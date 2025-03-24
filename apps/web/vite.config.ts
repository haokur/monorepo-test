/// <reference types="vite/client" />
import { readFileSync } from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { parseIniFile } from '@mono/utils';

const commonConfig = parseIniFile(
    readFileSync(path.resolve(__dirname, '../../env/.env')).toString()
);
const matchModeConfig = parseIniFile(
    readFileSync(path.resolve(__dirname, `../../env/.env.${process.env.NODE_ENV}`)).toString()
);
const envConfig = { ...commonConfig, ...matchModeConfig };
console.log(envConfig, 'vite.config.ts::14行');

export default defineConfig({
    root: __dirname,
    base: './',
    define: {
        'process.env.ENV_CONFIG': envConfig,
    },
    build: {
        outDir: './dist',
        copyPublicDir: true,
        sourcemap: true,
    },
    server: {
        host: '0.0.0.0',
        port: Number(envConfig.WEB_PORT),
    },
});
