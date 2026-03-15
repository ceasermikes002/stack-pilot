import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { createCommand } from './commands/create.js';

export function createCLI(): Command {
    const program = new Command();

    program
        .name('stackpilot')
        .description('AI-Powered SaaS Stack Generator CLI')
        .version('1.0.0');

    program
        .command('init')
        .description('Configure StackPilot AI provider and API keys')
        .action(initCommand);

    program
        .command('create')
        .description('Generate a new production-ready project')
        .action(createCommand);

    return program;
}
