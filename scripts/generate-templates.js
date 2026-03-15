import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.resolve(__dirname, '../templates');

const templates = [
  {
    name: 'nestjs-postgresql-prisma',
    description: 'Enterprise monorepo with NextJS Frontend, NestJS API Backend, PostgreSQL, and Prisma',
    setupCmd: [
      'npx create-turbo@latest . --example with-tailwind --skip-install %PM_FLAG%',
      'npx @nestjs/cli new apps/api --strict --skip-git %PM_FLAG%'
    ],
    env: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/{{projectName}}?schema=public"\n`,
    prd: '- Architecture: Monorepo (Turborepo)\n- Frontend: Next.js\n- Backend: NestJS API\n- Database: PostgreSQL\n- ORM: Prisma'
  },
  {
    name: 'nextjs-postgresql-drizzle',
    description: 'Enterprise monorepo combining Next.js App Router and Drizzle ORM',
    setupCmd: ['npx create-turbo@latest . --example with-tailwind --skip-install %PM_FLAG%'],
    env: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/{{projectName}}?schema=public"\n`,
    prd: '- Architecture: Monorepo (Turborepo)\n- Framework: Next.js App Router\n- DB: PostgreSQL\n- ORM: Drizzle'
  },
  {
    name: 'nextjs-firebase',
    description: 'Next.js App Router with Firebase Backend (Auth + Firestore)',
    setupCmd: ['npx create-turbo@latest . --example with-tailwind --skip-install %PM_FLAG%'],
    env: `NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."\nNEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."\nNEXT_PUBLIC_FIREBASE_PROJECT_ID="..."\n`,
    prd: '- Architecture: Monorepo (Turborepo)\n- Framework: Next.js App Router\n- Database Strategy: Firebase Firestore\n- Auth: Firebase Auth'
  },
  {
    name: 'nextjs-mongodb-mongoose',
    description: 'Enterprise monorepo combining Next.js App Router and MongoDB',
    setupCmd: ['npx create-turbo@latest . --example with-tailwind --skip-install %PM_FLAG%'],
    env: `MONGODB_URI="mongodb://localhost:27017/{{projectName}}"\n`,
    prd: '- Architecture: Monorepo (Turborepo)\n- Framework: Next.js App Router\n- Database: MongoDB\n- ORM: Mongoose'
  },
  {
    name: 'express-postgresql-prisma',
    description: 'Custom monorepo of NextJS frontend + Express.js backend with PostgreSQL and Prisma',
    setupCmd: [
      'npx create-turbo@latest . --example with-tailwind --skip-install %PM_FLAG%',
      'mkdir -p apps/api && cd apps/api && npm init -y && npm i express cors morgan helmet && npm i -D typescript @types/node @types/express @types/cors @types/morgan ts-node && npx tsc --init'
    ],
    env: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/{{projectName}}?schema=public"\nPORT=3001\n`,
    prd: '- Architecture: Monorepo (Turborepo)\n- Frontend: Next.js\n- Backend: Express.js API\n- Database: PostgreSQL\n- ORM: Prisma'
  },
  {
    name: 'fastify-postgresql-prisma',
    description: 'High-performance monorepo: NextJS frontend + Fastify backend with PostgreSQL and Prisma',
    setupCmd: [
      'npx create-turbo@latest . --example with-tailwind --skip-install %PM_FLAG%',
      'mkdir -p apps/api && cd apps/api && npm init -y && npm i fastify @fastify/cors @fastify/helmet && npm i -D typescript @types/node ts-node && npx tsc --init'
    ],
    env: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/{{projectName}}?schema=public"\nPORT=3001\n`,
    prd: '- Architecture: Monorepo (Turborepo)\n- Frontend: Next.js\n- Backend: Fastify API\n- Database: PostgreSQL\n- ORM: Prisma'
  }
];

async function generate() {
  for (const t of templates) {
    const dir = path.join(TEMPLATES_DIR, t.name);
    await fs.ensureDir(dir);

    // Write manifest
    await fs.writeJson(path.join(dir, 'manifest.json'), {
      name: t.name,
      description: t.description,
      setupCommands: Array.isArray(t.setupCmd) ? t.setupCmd : [t.setupCmd],
      postInstallCommands: []
    }, { spaces: 2 });

    const rootDir = path.join(dir, 'root');
    await fs.ensureDir(rootDir);

    // .env.example.hbs
    await fs.writeFile(path.join(rootDir, '.env.example.hbs'), t.env);

    // PRD.md.hbs
    await fs.writeFile(path.join(rootDir, 'PRD.md.hbs'), `# PRD\n## Project Name: {{projectName}}\n### Vision\n{{projectDescription}}\n\n### Requirements\n${t.prd}`);

    console.log(`Created template: ${t.name}`);
  }
}

generate().catch(console.error);
