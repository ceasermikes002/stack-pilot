#!/usr/bin/env node
import { createCLI } from './cli.js';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to load .env files manually to avoid noisy library logs
function loadEnv(filePath: string) {
    if (fs.existsSync(filePath)) {
        try {
            const envConfig = dotenv.parse(fs.readFileSync(filePath));
            for (const k in envConfig) {
                process.env[k] = envConfig[k];
            }
        } catch (err) {
            // Ignore parse errors
        }
    }
}

// Load .env from current working directory
loadEnv(path.join(process.cwd(), '.env'));

// Also load .env from the CLI's installation directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
loadEnv(path.join(__dirname, '../.env'));

async function main() {
    const cli = createCLI();
    await cli.parseAsync(process.argv);
}

main().catch((err) => {
    console.error("An unexpected error occurred:", err);
    process.exit(1);
});
