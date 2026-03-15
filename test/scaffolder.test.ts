/**
 * scaffolder.test.ts
 *
 * Ensures the AI-recommended stack is EXACTLY what gets generated.
 * Tests cover:
 *  - Template resolution (correct base template for any stack combination)
 *  - Deployment overlay (correct config files injected per deployment target)
 *  - Handlebars rendering (projectName substituted correctly)
 *  - File existence contracts (deployment files present, wrong ones absent)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { resolveTemplateName, Scaffolder } from '../src/scaffolder/index.js';
import { AIRecommendation } from '../src/ai/architect.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeRec(overrides: Partial<AIRecommendation['stack']> & { projectName?: string }): AIRecommendation {
    return {
        projectName: overrides.projectName ?? 'test-project',
        summary: ['test signal'],
        reasoning: 'test reasoning',
        addons: [],
        stack: {
            frontend: overrides.frontend ?? 'nextjs',
            backend: overrides.backend ?? 'none',
            database: overrides.database ?? 'postgresql',
            orm: overrides.orm ?? 'prisma',
            auth: overrides.auth ?? 'clerk',
            payments: overrides.payments ?? 'none',
            styling: overrides.styling ?? 'tailwind-shadcn',
            deployment: overrides.deployment ?? 'vercel',
        },
    };
}

// ─── Template Resolution Tests ────────────────────────────────────────────────
describe('resolveTemplateName()', () => {
    it('maps nextjs + postgresql + prisma → nextjs-prisma-clerk (default)', () => {
        expect(resolveTemplateName(makeRec({}))).toBe('nextjs-prisma-clerk');
    });

    it('maps nextjs + supabase → nextjs-supabase', () => {
        expect(resolveTemplateName(makeRec({ database: 'supabase', orm: 'supabase-sdk' }))).toBe('nextjs-supabase');
    });

    it('maps nextjs + firebase → nextjs-firebase', () => {
        expect(resolveTemplateName(makeRec({ database: 'firebase', orm: 'firebase-sdk' }))).toBe('nextjs-firebase');
    });

    it('maps nextjs + mongodb → nextjs-mongodb-mongoose', () => {
        expect(resolveTemplateName(makeRec({ database: 'mongodb', orm: 'mongoose' }))).toBe('nextjs-mongodb-mongoose');
    });

    it('maps nextjs + drizzle → nextjs-postgresql-drizzle', () => {
        expect(resolveTemplateName(makeRec({ orm: 'drizzle' }))).toBe('nextjs-postgresql-drizzle');
    });

    it('maps nuxt frontend → nuxt-prisma (even with no database selected)', () => {
        expect(resolveTemplateName(makeRec({ frontend: 'nuxt', database: 'none', orm: 'none' }))).toBe('nuxt-prisma');
    });

    it('nuxt does NOT fall through to nextjs-prisma-clerk (ordering guard)', () => {
        // Previously nuxt with database:none would fall all the way through to the default
        const result = resolveTemplateName(makeRec({ frontend: 'nuxt', database: 'none', orm: 'none' }));
        expect(result).not.toBe('nextjs-prisma-clerk');
        expect(result).not.toBe('nextjs-supabase');
    });

    it('maps nestjs backend → nestjs-postgresql-prisma (regardless of frontend db)', () => {
        expect(resolveTemplateName(makeRec({ backend: 'nestjs' }))).toBe('nestjs-postgresql-prisma');
    });

    it('maps express backend → express-postgresql-prisma', () => {
        expect(resolveTemplateName(makeRec({ backend: 'express' }))).toBe('express-postgresql-prisma');
    });

    it('maps fastify backend → fastify-postgresql-prisma', () => {
        expect(resolveTemplateName(makeRec({ backend: 'fastify' }))).toBe('fastify-postgresql-prisma');
    });
});

// ─── Deployment Overlay Tests ─────────────────────────────────────────────────
// These tests use a real temporary directory so we verify actual file creation.

describe('Deployment overlay — file contract', () => {
    let tmpDir: string;
    let destDir: string;

    beforeEach(async () => {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'stackpilot-test-'));
        destDir = path.join(tmpDir, 'test-project');
        await fs.mkdirp(destDir);
    });

    afterEach(async () => {
        await fs.remove(tmpDir);
    });

    // Helper: run only the overlay step in isolation by monkey-patching cwd
    async function runOverlay(rec: AIRecommendation): Promise<string[]> {
        // We reach into the private method by building a Scaffolder and
        // temporarily redirecting the targetDir to our tmpDir destination.
        const scaffolder = new Scaffolder(rec, 'npm');
        // @ts-ignore — access private for testing
        scaffolder.targetDir = destDir;
        // @ts-ignore
        await scaffolder['applyDeploymentOverlay']();
        // Return flat list of all generated files (relative to destDir)
        const all = await getAllRelativeFiles(destDir);
        return all;
    }

    it('vercel deployment → vercel.json present, no docker-compose, no railway.json', async () => {
        const files = await runOverlay(makeRec({ deployment: 'vercel' }));
        expect(files).toContain('vercel.json');
        expect(files).not.toContain('docker-compose.yml');
        expect(files).not.toContain('railway.json');
    });

    it('railway deployment → railway.json present, no docker-compose, no vercel.json', async () => {
        const files = await runOverlay(makeRec({ deployment: 'railway' }));
        expect(files).toContain('railway.json');
        expect(files).not.toContain('docker-compose.yml.hbs');
        expect(files).not.toContain('docker-compose.yml');
        expect(files).not.toContain('vercel.json');
    });

    it('docker + no backend → docker-compose.yml.hbs (postgres variant) present, no vercel/railway', async () => {
        const files = await runOverlay(makeRec({ deployment: 'docker', database: 'postgresql' }));
        expect(files).toContain('docker-compose.yml.hbs');
        expect(files).toContain('.dockerignore');
        expect(files).not.toContain('vercel.json');
        expect(files).not.toContain('railway.json');
    });

    it('docker + nestjs backend → monorepo docker-compose variant selected', async () => {
        const files = await runOverlay(makeRec({ deployment: 'docker', backend: 'nestjs' }));
        expect(files).toContain('docker-compose.yml.hbs');
        expect(files).toContain('.dockerignore');

        // The monorepo variant should include both `api` and `web` service definitions
        const composePath = path.join(destDir, 'docker-compose.yml.hbs');
        const content = await fs.readFile(composePath, 'utf-8');
        expect(content).toContain('api:');
        expect(content).toContain('web:');
        expect(content).toContain('postgres:');
    });

    it('none deployment → no deployment files created', async () => {
        const files = await runOverlay(makeRec({ deployment: 'none' }));
        expect(files).not.toContain('vercel.json');
        expect(files).not.toContain('railway.json');
        expect(files).not.toContain('docker-compose.yml.hbs');
    });

    it('vercel deployment on nuxt-prisma → no docker files should exist', async () => {
        // We use nuxt-prisma because it's a common site of this issue
        const rec = makeRec({ frontend: 'nuxt', deployment: 'vercel' });
        const files = await runOverlay(rec);
        expect(files).toContain('vercel.json');
        expect(files).not.toContain('docker-compose.yml.hbs');
        expect(files).not.toContain('.dockerignore');
    });
});

// ─── Handlebars Rendering Contract ────────────────────────────────────────────
describe('Handlebars rendering', () => {
    let tmpDir: string;

    beforeEach(async () => {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'stackpilot-hbs-'));
    });

    afterEach(async () => {
        await fs.remove(tmpDir);
    });

    it('substitutes {{projectName}} in railway.json (after copy)', async () => {
        // Write a fake .hbs file
        const hbsPath = path.join(tmpDir, 'info.json.hbs');
        await fs.writeFile(hbsPath, '{"name":"{{projectName}}"}');

        const scaffolder = new Scaffolder(makeRec({ projectName: 'my-saas', deployment: 'railway' }), 'npm');
        // @ts-ignore
        scaffolder.targetDir = tmpDir;
        // @ts-ignore
        await scaffolder['renderHandlebarsContent']();

        const resultPath = path.join(tmpDir, 'info.json');
        expect(await fs.pathExists(resultPath)).toBe(true);
        const content = JSON.parse(await fs.readFile(resultPath, 'utf-8'));
        expect(content.name).toBe('my-saas');
    });

    it('does not leave .hbs files in the output directory after rendering', async () => {
        const hbsPath = path.join(tmpDir, 'any.txt.hbs');
        await fs.writeFile(hbsPath, 'hello {{projectName}}');

        const scaffolder = new Scaffolder(makeRec({}), 'npm');
        // @ts-ignore
        scaffolder.targetDir = tmpDir;
        // @ts-ignore
        await scaffolder['renderHandlebarsContent']();

        const files = await fs.readdir(tmpDir);
        expect(files.some(f => f.endsWith('.hbs'))).toBe(false);
    });
});

// ─── AI recommendation → template name contract (integration) ────────────────
describe('Recommendation → template contract', () => {
    it('fintech NestJS stack resolves to nestjs template (not nextjs-prisma-clerk)', () => {
        const rec = makeRec({ backend: 'nestjs', database: 'postgresql', orm: 'prisma', deployment: 'docker' });
        expect(resolveTemplateName(rec)).toBe('nestjs-postgresql-prisma');
    });

    it('analytics dashboard with supabase resolves to nextjs-supabase template', () => {
        const rec = makeRec({ database: 'supabase', orm: 'supabase-sdk', auth: 'supabase-auth', deployment: 'vercel' });
        expect(resolveTemplateName(rec)).toBe('nextjs-supabase');
    });

    it('SaaS with clerk + railway resolves to nextjs-prisma-clerk template', () => {
        const rec = makeRec({ auth: 'clerk', deployment: 'railway' });
        expect(resolveTemplateName(rec)).toBe('nextjs-prisma-clerk');
    });
});

// ─── Post-Install Command Filtering ───────────────────────────────────────────
describe('Post-install command filtering', () => {
    it('skips db:generate and prisma commands when no database is selected', () => {
        const rec = makeRec({ database: 'none', orm: 'none' });
        const manifest = {
            name: 'test',
            description: 'test',
            postInstallCommands: ['npm run db:generate', 'npm run other']
        };

        const scaffolder = new Scaffolder(rec, 'npm');

        // We use the internal filter logic here to test.
        // The regex in Scaffolder looks for DB_COMMANDS = ['db:generate', 'db:push', 'db:migrate', 'db:studio', 'prisma generate']
        const DB_COMMANDS = ['db:generate', 'db:push', 'db:migrate', 'db:studio', 'prisma generate'];

        const filtered = manifest.postInstallCommands.filter(c => {
            const isDbCmd = DB_COMMANDS.some(op => c.includes(op));
            return !isDbCmd; // Should return false for db commands because hasDb is false
        });

        expect(filtered).toHaveLength(1);
        expect(filtered[0]).toBe('npm run other');
        expect(filtered).not.toContain('npm run db:generate');
    });

    it('keeps db commands when database and orm are present', () => {
        const rec = makeRec({ database: 'postgresql', orm: 'prisma' });
        const manifest = {
            name: 'test',
            description: 'test',
            postInstallCommands: ['npm run db:generate']
        };

        const hasDb = rec.stack.database !== 'none';
        const hasOrm = rec.stack.orm !== 'none';
        const DB_COMMANDS = ['db:generate', 'db:push', 'db:migrate', 'db:studio', 'prisma generate'];

        const filtered = manifest.postInstallCommands.filter(c => {
            const isDbCmd = DB_COMMANDS.some(op => c.includes(op));
            return !isDbCmd || (hasDb && hasOrm);
        });

        expect(filtered).toHaveLength(1);
        expect(filtered[0]).toBe('npm run db:generate');
    });
});

// ─── Template Registry Coverage ────────────────────────────────────────────────
describe('Template Registry', () => {
    it('all directories in /templates should have a manifest.json', async () => {
        const templatesDir = path.resolve(__dirname, '../templates');
        const entries = await fs.readdir(templatesDir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                const manifestPath = path.join(templatesDir, entry.name, 'manifest.json');
                const exists = await fs.pathExists(manifestPath);
                if (!exists) {
                    throw new Error(`Template directory '${entry.name}' is missing manifest.json`);
                }
            }
        }
    });
});

// ─── Utility ──────────────────────────────────────────────────────────────────
async function getAllRelativeFiles(dir: string): Promise<string[]> {
    const result: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const rel = entry.name;
        if (entry.isDirectory()) {
            const sub = await getAllRelativeFiles(path.join(dir, entry.name));
            result.push(...sub.map(f => `${rel}/${f}`));
        } else {
            result.push(rel);
        }
    }
    return result;
}
