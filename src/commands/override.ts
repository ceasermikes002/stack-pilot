import inquirer from 'inquirer';
import chalk from 'chalk';
import { Validator, StackChoice } from '../validator/index.js';
import { logger } from '../utils/logger.js';
import { section, divider } from '../utils/ui.js';

const dim = chalk.hex('#6B7280');
const silver = chalk.hex('#C0C0C0');
const muted = chalk.hex('#4B5563');

export async function handleOverrideFlow(currentStack: StackChoice, validator: Validator): Promise<StackChoice> {
    let isDone = false;
    let newStack = { ...currentStack };
    const config = validator.getConfig();

    console.log();
    section('Stack Override');
    console.log();

    while (!isDone) {
        const { category } = await inquirer.prompt<{ category: keyof StackChoice | '_done' }>([
            {
                type: 'list',
                name: 'category',
                message: silver('Which layer would you like to change?'),
                prefix: silver('  ›'),
                choices: [
                    { name: `${silver('Frontend')}    ${dim(currentStack.frontend || 'none')}`, value: 'frontend' },
                    { name: `${silver('Backend')}     ${dim(currentStack.backend || 'none')}`, value: 'backend' },
                    { name: `${silver('Database')}    ${dim(currentStack.database || 'none')}`, value: 'database' },
                    { name: `${silver('ORM')}         ${dim(currentStack.orm || 'none')}`, value: 'orm' },
                    { name: `${silver('Auth')}        ${dim(currentStack.auth || 'none')}`, value: 'auth' },
                    { name: `${silver('Payments')}    ${dim(currentStack.payments || 'none')}`, value: 'payments' },
                    { name: `${silver('Styling')}     ${dim(currentStack.styling || 'none')}`, value: 'styling' },
                    { name: `${silver('Deployment')}  ${dim(currentStack.deployment || 'none')}`, value: 'deployment' },
                    { name: `${muted('─────────────────────────')}`, value: '_sep', disabled: true },
                    { name: `${silver('✓ Done')}  ${dim('proceed to generation')}`, value: '_done' },
                ],
            }
        ]);

        if (category === '_done') {
            isDone = true;
            continue;
        }

        const catOptions = config[category as string];
        if (!catOptions) continue;

        const availableOptions = catOptions.map(opt => ({
            name: `${silver(opt.name)}  ${dim(opt.description)}`,
            value: opt.id,
        }));

        const { selection } = await inquirer.prompt<{ selection: string }>([
            {
                type: 'list',
                name: 'selection',
                message: silver(`New ${category}:`),
                prefix: silver('  ›'),
                choices: availableOptions,
                default: newStack[category as keyof StackChoice],
            }
        ]);

        const proposedStack = { ...newStack, [category]: selection };
        const validation = validator.validate(proposedStack);

        if (validation.isValid) {
            newStack = proposedStack;
            currentStack = newStack; // update hints in choice list
            console.log();
            logger.success(`${category} → ${selection}`);
            console.log();
        } else {
            console.log();
            logger.error('Incompatible combination — change reverted.');
            validation.errors.forEach(e => logger.warn(e));
            console.log();
        }
    }

    return newStack;
}
