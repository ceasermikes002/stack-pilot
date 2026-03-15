import fs from 'fs-extra';
import { getConfigPath } from '../utils/paths.js';

export interface StackConfig {
    [category: string]: Array<{
        id: string;
        name: string;
        description: string;
        priority: string;
        isFullstack?: boolean;
        requiresFullstackFrontend?: boolean;
        compatibleDatabases?: string[];
        requiredDatabase?: string;
        compatibleFrontends?: string[];
        compatibleBackends?: string[];
    }>;
}

export type StackChoice = {
    frontend?: string;
    backend?: string;
    database?: string;
    orm?: string;
    auth?: string;
    payments?: string;
    styling?: string;
    deployment?: string;
};

export class Validator {
    private config: StackConfig;

    constructor(configPath?: string) {
        const defaultPath = getConfigPath();
        const resolvedPath = configPath || defaultPath;


        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`Config file not found at ${resolvedPath}`);
        }

        this.config = fs.readJsonSync(resolvedPath);
    }

    getConfig(): StackConfig {
        return this.config;
    }

    public validate(stack: StackChoice): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check if selections exist in config.
        // "none" is a universal sentinel meaning "not needed for this project" —
        // some categories have it explicitly (payments, backend) but we must
        // accept it for ANY category so that minimal apps (calculators, static
        // sites) don't need a database / auth / ORM.
        for (const [category, choiceId] of Object.entries(stack)) {
            if (!choiceId || choiceId === 'none') continue; // "none" always valid
            const categoryOptions = this.config[category];
            if (!categoryOptions) {
                errors.push(`Invalid stack category: ${category}`);
                continue;
            }
            const optionExists = categoryOptions.some(opt => opt.id === choiceId);
            if (!optionExists) {
                errors.push(`Invalid option '${choiceId}' for category '${category}'`);
            }
        }

        if (errors.length > 0) return { isValid: false, errors };

        // Validations based on constraints
        const frontendOpt = this.getOption('frontend', stack.frontend);
        const backendOpt = this.getOption('backend', stack.backend);
        const ormOpt = this.getOption('orm', stack.orm);
        const authOpt = this.getOption('auth', stack.auth);
        const deploymentOpt = this.getOption('deployment', stack.deployment);

        if (backendOpt?.requiresFullstackFrontend && !frontendOpt?.isFullstack) {
            errors.push(`Backend option '${backendOpt.id}' requires a fullstack frontend.`);
        }

        if (ormOpt?.compatibleDatabases && stack.database) {
            if (!ormOpt.compatibleDatabases.includes(stack.database)) {
                errors.push(`ORM '${ormOpt.id}' is not compatible with database '${stack.database}'`);
            }
        }

        if (authOpt?.requiredDatabase && stack.database) {
            if (authOpt.requiredDatabase !== stack.database) {
                errors.push(`Auth '${authOpt.id}' requires database '${authOpt.requiredDatabase}'`);
            }
        }

        if (deploymentOpt?.compatibleFrontends && stack.frontend) {
            if (!deploymentOpt.compatibleFrontends.includes(stack.frontend)) {
                errors.push(`Deployment '${deploymentOpt.id}' is not compatible with frontend '${stack.frontend}'`);
            }
        }

        if (deploymentOpt?.compatibleBackends && stack.backend) {
            if (!deploymentOpt.compatibleBackends.includes(stack.backend)) {
                errors.push(`Deployment '${deploymentOpt.id}' is not compatible with backend '${stack.backend}'`);
            }
        }

        return { isValid: errors.length === 0, errors };
    }

    private getOption(category: string, id: string | undefined) {
        if (!id) return undefined;
        if (!this.config[category]) return undefined;
        return this.config[category].find(opt => opt.id === id);
    }
}
