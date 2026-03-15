import { describe, it, expect, beforeEach } from 'vitest';
import { Validator, StackChoice } from '../src/validator/index.js';
import path from 'path';

describe('Configuration Engine & Validator', () => {
    let validator: Validator;

    beforeEach(() => {
        // Rely on the actual stacks.config.json since it defines our ground truth schema
        validator = new Validator(path.resolve(__dirname, '../config/stacks.config.json'));
    });

    it('should load config successfully', () => {
        expect(validator.getConfig()).toBeDefined();
        expect(validator.getConfig().frontend).toBeDefined();
        expect(validator.getConfig().frontend.length).toBeGreaterThan(0);
    });

    it('should validate a compatible stack', () => {
        const validStack: StackChoice = {
            frontend: 'nextjs',
            backend: 'none',
            database: 'postgresql',
            orm: 'prisma',
            auth: 'clerk',
            payments: 'stripe',
            styling: 'tailwind-shadcn',
            deployment: 'vercel'
        };

        const result = validator.validate(validStack);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('should invalidate an incompatible ORM and Database', () => {
        const invalidStack: StackChoice = {
            frontend: 'nextjs',
            database: 'mongodb',
            orm: 'prisma', // Prisma expects postgresql in our config
        };

        const result = validator.validate(invalidStack);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain("is not compatible with database 'mongodb'");
    });

    it('should invalidate specific Auth bounds (like Firebase Auth with Postgres)', () => {
        const invalidStack: StackChoice = {
            database: 'postgresql',
            auth: 'firebase-auth'
        };

        const result = validator.validate(invalidStack);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain("requires database 'firebase'");
    });

    it('should accept "none" for database/orm/auth — minimal apps like calculators need no DB or auth', () => {
        const minimalStack: StackChoice = {
            frontend: 'nextjs',
            backend: 'none',
            database: 'none',
            orm: 'none',
            auth: 'none',
            payments: 'none',
            styling: 'tailwind-shadcn',
            deployment: 'vercel',
        };
        const result = validator.validate(minimalStack);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('should accept "none" for nuxt calculator — AI returning "none" fields must not cause rejection', () => {
        const nuxtCalculator: StackChoice = {
            frontend: 'nuxt',
            backend: 'none',
            database: 'none',
            orm: 'none',
            auth: 'none',
            payments: 'none',
            styling: 'tailwind-shadcn',
            deployment: 'vercel',
        };
        const result = validator.validate(nuxtCalculator);
        expect(result.isValid).toBe(true);
    });
});
