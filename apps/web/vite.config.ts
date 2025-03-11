/// <reference types="vite/client" />
import { readFileSync } from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { parseIniFile } from '@mono/utils';

const commonConfig = parseIniFile(
    readFileSync(path.resolve(__dirname, '../../env/.env')).toString()
);
const envConfig = parseIniFile(
    readFileSync(path.resolve(__dirname, `../../env/.env.${process.env.NODE_ENV}`)).toString()
);

export default defineConfig({
    root: __dirname,
    base: './',
    define: {
        'process.env.ENV_CONFIG': { ...commonConfig, ...envConfig },
    },
    build: {
        outDir: './dist',
        copyPublicDir: true,
        sourcemap: true,
    },
});
