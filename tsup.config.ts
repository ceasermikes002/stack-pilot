import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    target: 'node22',
    clean: true,
    minify: true,
    sourcemap: true,
    outExtension() {
        return {
            js: '.js',
        };
    },
});
