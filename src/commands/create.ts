import inquirer from 'inquirer';
import chalk from 'chalk';
import { logger, createSpinner } from '../utils/logger.js';
import { banner, section, kv, divider, successBox, nextSteps, header } from '../utils/ui.js';
import { Validator, StackChoice } from '../validator/index.js';
import { getStackRecommendation, AIRecommendation } from '../ai/architect.js';
import { handleOverrideFlow } from './override.js';
import { Scaffolder } from '../scaffolder/index.js';

const dim = chalk.hex('#6B7280');
const silver = chalk.hex('#C0C0C0');
const accent = chalk.hex('#E5E7EB').bold;
const muted = chalk.hex('#4B5563');

export async function createCommand() {
    banner();

    const { description } = await inquirer.prompt<{ description: string }>([
        {
            type: 'input',
            name: 'description',
            message: dim('What are you building?'),
            prefix: silver('  ›'),
            validate: (input) => input.trim().length > 5 || dim('Please describe what you want to build in more detail.'),
        }
    ]);

    console.log();
    const spinner = createSpinner('Analyzing your project with AI…').start();

    let recommendation: AIRecommendation;
    const validator = new Validator();

    try {
        recommendation = await getStackRecommendation(description, validator);
        spinner.succeed(silver('Analysis complete'));
    } catch (err: any) {
        spinner.fail('Failed to generate recommendation');
        logger.error(err.message);
        process.exit(1);
    }

    // ── Reasoning ─────────────────────────────────────────────────────────────
    section('Architecture Reasoning');
    console.log();
    const words = recommendation.reasoning.split(' ');
    let line = '    ';
    const maxW = 74;
    for (const w of words) {
        if ((line + w).length > maxW) {
            console.log(dim(line));
            line = `    ${w} `;
        } else {
            line += `${w} `;
        }
    }
    if (line.trim()) console.log(dim(line));

    // ── Signal summary ────────────────────────────────────────────────────────
    if (recommendation.summary?.length) {
        console.log();
        recommendation.summary.forEach(s => {
            console.log(`    ${muted('─')} ${dim(s)}`);
        });
    }

    // ── Stack table ───────────────────────────────────────────────────────────
    section('Recommended Stack');
    console.log();
    printStack(recommendation.stack, validator);

    // ── Confirm ───────────────────────────────────────────────────────────────
    divider();
    const { isAccepted } = await inquirer.prompt<{ isAccepted: boolean }>([
        {
            type: 'confirm',
            name: 'isAccepted',
            message: silver('Generate this project?'),
            prefix: silver('  ›'),
            default: true,
        }
    ]);

    let currentStack = recommendation.stack;
    if (!isAccepted) {
        currentStack = await handleOverrideFlow(currentStack, validator);
        section('Final Stack');
        console.log();
        printStack(currentStack, validator);
        divider();
    }

    // ── Package manager ───────────────────────────────────────────────────────
    const { pm } = await inquirer.prompt<{ pm: string }>([
        {
            type: 'list',
            name: 'pm',
            message: silver('Package manager:'),
            prefix: silver('  ›'),
            choices: [
                { name: `${silver('npm')}   ${dim('(Node default)')}`, value: 'npm' },
                { name: `${silver('pnpm')}  ${dim('(Fast, disk-efficient)')}`, value: 'pnpm' },
                { name: `${silver('yarn')}  ${dim('(Yarn classic)')}`, value: 'yarn' },
                { name: `${silver('bun')}   ${dim('(Bun runtime)')}`, value: 'bun' },
            ],
            default: 'npm',
        }
    ]);

    console.log();
    const scaffoldSpinner = createSpinner(`Scaffolding ${accent(recommendation.projectName)}…`).start();

    try {
        const scaffolder = new Scaffolder(recommendation, pm);
        await scaffolder.generate(scaffoldSpinner);
        scaffoldSpinner.succeed(silver('Scaffold complete'));
        successBox(recommendation.projectName);
        nextSteps(recommendation.projectName, pm);
    } catch (err: any) {
        scaffoldSpinner.fail('Scaffolding failed');
        logger.error(err.message);
    }
}

function printStack(stack: StackChoice, validator: Validator) {
    const config = validator.getConfig();

    const resolve = (category: string, id?: string): string | undefined => {
        if (!id || id === 'none') return undefined;
        const opt = config[category]?.find(o => o.id === id);
        return opt ? opt.name : id;
    };

    kv('Frontend', resolve('frontend', stack.frontend));
    kv('Backend', resolve('backend', stack.backend));
    kv('Database', resolve('database', stack.database));
    kv('ORM', resolve('orm', stack.orm));
    kv('Auth', resolve('auth', stack.auth));
    kv('Payments', resolve('payments', stack.payments));
    kv('Styling', resolve('styling', stack.styling));
    kv('Deployment', resolve('deployment', stack.deployment));
    console.log();
}
