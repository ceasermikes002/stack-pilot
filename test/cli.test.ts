import { describe, it, expect } from 'vitest';
import { createCLI } from '../src/cli.js';

describe('CLI Base', () => {
    it('should have correct name and description', () => {
        const cli = createCLI();
        expect(cli.name()).toBe('stackpilot');
        expect(cli.description()).toBe('AI-Powered SaaS Stack Generator CLI');
    });

    it('should register create and init commands', () => {
        const cli = createCLI();
        const commands = cli.commands.map(c => c.name());
        expect(commands).toContain('create');
        expect(commands).toContain('init');
    });
});
