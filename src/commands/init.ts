import inquirer from 'inquirer';
import chalk from 'chalk';
import { getConfig, saveConfig, AIProvider } from '../ai/config.js';
import { logger } from '../utils/logger.js';
import { banner, section, divider } from '../utils/ui.js';

const dim = chalk.hex('#6B7280');
const silver = chalk.hex('#C0C0C0');

export async function initCommand() {
    banner();
    section('AI Provider Setup');

    logger.info('Configure your preferred AI provider and API keys.');
    logger.info(`Tip: Use ${silver('STACKPILOT_GEMINI_API_KEY')} for zero-config CI/CD.`);
    console.log();

    const config = getConfig();

    const { provider } = await inquirer.prompt<{ provider: AIProvider }>([
        {
            type: 'list',
            name: 'provider',
            message: silver('Select your AI provider:'),
            prefix: silver('  ›'),
            choices: [
                {
                    name: `${silver('Google Gemini')}   ${dim('(Recommended · gemini-2.5-flash)')}`,
                    value: 'gemini',
                },
                {
                    name: `${silver('Anthropic Claude')} ${dim('(claude-3-5-sonnet)')}`,
                    value: 'anthropic',
                },
                {
                    name: `${silver('OpenAI')}           ${dim('(gpt-4o)')}`,
                    value: 'openai',
                },
            ],
            default: config.aiProvider || 'gemini',
        }
    ]);

    const keyLabels: Record<AIProvider, string> = {
        gemini: 'Google Gemini API Key',
        anthropic: 'Anthropic API Key',
        openai: 'OpenAI API Key',
    };

    const currentKey: Record<AIProvider, string> = {
        gemini: config.geminiApiKey || '',
        anthropic: config.anthropicApiKey || '',
        openai: config.openaiApiKey || '',
    };

    let apiKey = currentKey[provider];

    // SKIP PROMPT for Gemini if key is already in environment (the "Free" tier experience)
    if (provider === 'gemini' && process.env.STACKPILOT_GEMINI_API_KEY) {
        logger.info(`${silver('Google Gemini')} is currently using the ${chalk.green('Developer Tier (Free)')}.`);
        logger.info(dim('No manual key entry required.'));
        apiKey = process.env.STACKPILOT_GEMINI_API_KEY;
    } else {
        const result = await inquirer.prompt<{ apiKey: string }>([
            {
                type: 'password',
                name: 'apiKey',
                message: silver(keyLabels[provider] + ':'),
                prefix: silver('  ›'),
                default: currentKey[provider],
                mask: '●',
                validate: (input) => input.trim().length > 0 || dim('An API key is required to continue.'),
            }
        ]);
        apiKey = result.apiKey;
    }

    const newConfig = { ...config, aiProvider: provider };
    if (provider === 'gemini') newConfig.geminiApiKey = apiKey;
    if (provider === 'anthropic') newConfig.anthropicApiKey = apiKey;
    if (provider === 'openai') newConfig.openaiApiKey = apiKey;

    saveConfig(newConfig);

    console.log();
    divider();
    console.log();
    logger.success(`Provider set to ${provider}. Run ${silver('stackpilot create')} to scaffold your first project.`);
    console.log();
}
