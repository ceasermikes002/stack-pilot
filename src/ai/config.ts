import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.stackpilot');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export type AIProvider = 'gemini' | 'openai' | 'anthropic';

export interface GlobalConfig {
    aiProvider?: AIProvider;
    geminiApiKey?: string;
    openaiApiKey?: string;
    anthropicApiKey?: string;
}

export function getConfig(): GlobalConfig {
    let config: GlobalConfig = {};
    if (fs.existsSync(CONFIG_FILE)) {
        try {
            config = fs.readJsonSync(CONFIG_FILE);
        } catch (err) {
            // Fallback to empty
        }
    }

    // Merge with Environment Variables
    return {
        ...config,
        aiProvider: (process.env.STACKPILOT_AI_PROVIDER as AIProvider) || config.aiProvider || 'gemini',
        geminiApiKey: process.env.STACKPILOT_GEMINI_API_KEY || config.geminiApiKey,
        openaiApiKey: process.env.STACKPILOT_OPENAI_API_KEY || config.openaiApiKey,
        anthropicApiKey: process.env.STACKPILOT_ANTHROPIC_API_KEY || config.anthropicApiKey,
    };
}

export function saveConfig(config: GlobalConfig): void {
    fs.ensureDirSync(CONFIG_DIR);
    fs.writeJsonSync(CONFIG_FILE, config, { spaces: 2 });
}
