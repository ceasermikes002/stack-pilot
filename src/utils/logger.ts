import chalk from 'chalk';
import ora, { Ora } from 'ora';

// Re-export everything from the new UI module for backwards compat
export { logger, createSpinner } from './ui.js';
