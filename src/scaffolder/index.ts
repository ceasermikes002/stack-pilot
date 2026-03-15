import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { execa } from 'execa';
import Handlebars from 'handlebars';
import { logger } from '../utils/logger.js';
import { Ora } from 'ora';
import { AIRecommendation } from '../ai/architect.js';
import { fileURLToPath } from 'url';
import { getTemplatesPath, getDeploymentsPath } from '../utils/paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface TemplateManifest {
    name: string;
    description: string;
    setupCommands?: string[];
    postInstallCommands?: string[];
    requiredEnvVars?: string[];
    packageManager?: 'npm' | 'yarn' | 'pnpm' | 'bun';
}

// ─── Deployment → files to inject ────────────────────────────────────────────
// Maps a deployment id to which file(s) inside `deployments/<id>/` to copy.
// `dest` is relative to the project root. Handlebars templates get rendered.
interface DeploymentFile {
    src: string;   // relative to deployments/<id>/
    dest: string;  // relative to generated project root
}

const DEPLOYMENT_FILES: Record<string, DeploymentFile[]> = {
    vercel: [
        { src: 'vercel.json', dest: 'vercel.json' },
    ],
    railway: [
        { src: 'railway.json', dest: 'railway.json' },
    ],
    docker: [
        { src: '.dockerignore', dest: '.dockerignore' },
    ],
};

// Which docker-compose variant to use based on topology
function getDockerComposeVariant(rec: AIRecommendation): string {
    const { backend, database } = rec.stack;
    if (backend && backend !== 'none') {
        // Full monorepo: api + web + postgres
        return 'docker-compose.monorepo.yml.hbs';
    }
    if (database === 'postgresql') {
        // Fullstack Next.js with local postgres
        return 'docker-compose.postgres.yml.hbs';
    }
    // No local DB needed (firebase, supabase, mongodb atlas)
    return 'docker-compose.yml.hbs';
}

export function resolveTemplateName(rec: AIRecommendation): string {
    const { frontend, backend, orm, database } = rec.stack;

    // Dedicated backend (NestJS/Express/Fastify) always wins regardless of frontend
    if (backend === 'nestjs') return 'nestjs-postgresql-prisma';
    if (backend === 'express') return 'express-postgresql-prisma';
    if (backend === 'fastify') return 'fastify-postgresql-prisma';

    // Nuxt — check BEFORE nextjs-specific rules so nuxt+no-db is handled correctly
    if (frontend === 'nuxt') return 'nuxt-prisma';

    if (frontend === 'nextjs' && database === 'supabase') return 'nextjs-supabase';
    if (frontend === 'nextjs' && database === 'firebase') return 'nextjs-firebase';
    if (frontend === 'nextjs' && database === 'mongodb') return 'nextjs-mongodb-mongoose';
    if (frontend === 'nextjs' && orm === 'drizzle') return 'nextjs-postgresql-drizzle';

    // Default: Next.js + Prisma + Clerk
    return 'nextjs-prisma-clerk';
}

export class Scaffolder {
    private targetDir: string;
    private templateDir: string;

    constructor(
        private generationData: AIRecommendation,
        private preferredPackageManager: string = 'npm'
    ) {
        // Enforce project storage in a central workspace
        const homeDir = os.homedir();
        const projectsRoot = path.join(homeDir, 'Documents', 'StackPilot', 'projects');

        this.targetDir = path.resolve(projectsRoot, this.generationData.projectName);
        const name = resolveTemplateName(this.generationData);
        this.templateDir = path.join(getTemplatesPath(), name);
    }

    public async generate(spinner: Ora) {
        if (!fs.existsSync(this.templateDir)) {
            throw new Error(`Template not found at ${this.templateDir}. Please ensure templates are generated.`);
        }
        if (fs.existsSync(this.targetDir)) {
            throw new Error(`Directory ${this.targetDir} already exists. Please choose a different project name or delete it.`);
        }

        fs.mkdirSync(this.targetDir, { recursive: true });

        // 1. Read Manifest
        const manifestPath = path.join(this.templateDir, 'manifest.json');
        let manifest: TemplateManifest = { name: 'Unknown', description: '' };
        if (fs.existsSync(manifestPath)) {
            manifest = await fs.readJson(manifestPath);
        }

        // 2. Run initial scaffold scripts (e.g. create-turbo, @nestjs/cli new)
        if (manifest.setupCommands && manifest.setupCommands.length > 0) {
            spinner.text = 'Executing upstream scaffolding commands…';
            const cmds = manifest.setupCommands.map(c =>
                c.replace(/%PM_FLAG%/g, `--package-manager ${this.preferredPackageManager}`)
            );
            await this.runCommands(cmds, 'inherit', spinner);
        }

        // 3. Overlay template root files
        spinner.text = 'Overlaying monorepo structure & engineering practices…';
        await this.copyTemplateFiles();

        // 4. Inject deployment-specific config files
        spinner.text = 'Injecting deployment configuration…';
        await this.applyDeploymentOverlay();

        // 5. Render all Handlebars templates
        spinner.text = 'Rendering project configurations…';
        await this.renderHandlebarsContent();

        // 6. Git init
        spinner.text = 'Initializing git repository…';
        await this.runCommands(['git init'], 'pipe', spinner);

        // 7. Install dependencies
        spinner.text = `Installing dependencies via ${this.preferredPackageManager}…`;
        await this.runCommands([`${this.preferredPackageManager} install`], 'inherit', spinner);

        // 8. Post-install (e.g. prisma generate)
        if (manifest.postInstallCommands && manifest.postInstallCommands.length > 0) {
            spinner.text = 'Running post-install configuration…';
            const { database, orm } = this.generationData.stack;
            const hasDb = database && database !== 'none';
            const hasOrm = orm && orm !== 'none';

            // Filter out database-related commands when the stack has no database or ORM.
            // This prevents "Missing script: db:generate" errors for minimal apps.
            const DB_COMMANDS = ['db:generate', 'db:push', 'db:migrate', 'db:studio', 'prisma generate'];
            const cmds = manifest.postInstallCommands
                .filter(c => {
                    const isDbCmd = DB_COMMANDS.some(op => c.includes(op));
                    return !isDbCmd || (hasDb && hasOrm);
                })
                .map(c =>
                    c.replace(/%PM%/g, this.preferredPackageManager === 'npm' ? 'npx' : this.preferredPackageManager)
                        .replace(/%PKG_MGR%/g, this.preferredPackageManager)
                );

            if (cmds.length > 0) await this.runCommands(cmds, 'inherit', spinner);
        }
    }

    /**
     * Copies deployment-specific files from `deployments/<id>/` into the
     * generated project. For `docker`, chooses the right compose variant
     * based on the stack topology. Renders .hbs files in-place.
     */
    private async applyDeploymentOverlay() {
        const deployment = this.generationData.stack.deployment;
        if (!deployment || deployment === 'none') return;

        const deploymentsRoot = getDeploymentsPath();
        const deploymentDir = path.join(deploymentsRoot, deployment);

        if (!fs.existsSync(deploymentDir)) {
            logger.warn(`No deployment overlay found for '${deployment}' — skipping.`);
            return;
        }

        const staticFiles = DEPLOYMENT_FILES[deployment] ?? [];
        for (const { src, dest } of staticFiles) {
            const srcPath = path.join(deploymentDir, src);
            const destPath = path.join(this.targetDir, dest);
            if (fs.existsSync(srcPath)) {
                await fs.copy(srcPath, destPath, { overwrite: true });
            }
        }

        // Docker needs a compose file chosen dynamically
        if (deployment === 'docker') {
            const variant = getDockerComposeVariant(this.generationData);
            const srcPath = path.join(deploymentDir, variant);
            const destPath = path.join(this.targetDir, 'docker-compose.yml.hbs');
            if (fs.existsSync(srcPath)) {
                await fs.copy(srcPath, destPath, { overwrite: true });
            } else {
                logger.warn(`Docker compose variant '${variant}' not found — falling back to generic.`);
                const fallback = path.join(deploymentDir, 'docker-compose.yml.hbs');
                if (fs.existsSync(fallback)) {
                    await fs.copy(fallback, path.join(this.targetDir, 'docker-compose.yml.hbs'), { overwrite: true });
                }
            }
        }
    }

    private async copyTemplateFiles() {
        const rootTemplateDir = path.join(this.templateDir, 'root');
        if (!fs.existsSync(rootTemplateDir)) return; // Some templates have no root overlay
        await fs.copy(rootTemplateDir, this.targetDir, {
            filter: (src) => !src.includes('node_modules') && !src.includes('.git')
        });
    }

    private async renderHandlebarsContent() {
        const files = await this.getAllFiles(this.targetDir);
        const hbsFiles = files.filter(f => f.endsWith('.hbs'));
        const data = {
            projectName: this.generationData.projectName,
            projectDescription: this.generationData.summary.join(' '),
            reasoning: this.generationData.reasoning,
            stack: this.generationData.stack,
        };

        for (const file of hbsFiles) {
            const content = await fs.readFile(file, 'utf-8');
            const compiled = Handlebars.compile(content);
            const output = compiled(data);
            const newPath = file.slice(0, -4); // strip .hbs
            await fs.writeFile(newPath, output, 'utf-8');
            await fs.remove(file);
        }
    }

    private async runCommands(commands: string[], stdio: 'pipe' | 'inherit' = 'inherit', spinner?: Ora) {
        for (const cmd of commands) {
            try {
                if (stdio === 'inherit' && spinner) {
                    spinner.stop();
                    logger.info(`Running: ${cmd}`);
                }

                await execa(cmd, { cwd: this.targetDir, shell: true, stdio });

                if (stdio === 'inherit' && spinner) {
                    spinner.start();
                }
            } catch (err: any) {
                logger.warn(`Non-fatal warning executing '${cmd}': ${err.message}`);
                if (stdio === 'inherit' && spinner) {
                    spinner.start();
                }
            }
        }
    }

    private async getAllFiles(dir: string): Promise<string[]> {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const files: string[] = [];
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...(await this.getAllFiles(fullPath)));
            } else {
                files.push(fullPath);
            }
        }
        return files;
    }
}
