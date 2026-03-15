import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getProjectRoot(): string {
    let currentDir = __dirname;
    while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
        const parent = path.dirname(currentDir);
        if (parent === currentDir) {
            throw new Error('Could not find project root containing package.json');
        }
        currentDir = parent;
    }
    return currentDir;
}

export function getConfigPath(): string {
    return path.join(getProjectRoot(), 'config', 'stacks.config.json');
}

export function getTemplatesPath(): string {
    return path.join(getProjectRoot(), 'templates');
}

export function getDeploymentsPath(): string {
    return path.join(getProjectRoot(), 'deployments');
}
