/// <reference types="vite/client" />
import { readFileSync } from 'fs';
import path from 'path';
import { parseIniFile } from '@mono/utils';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';
import vueJsx from '@vitejs/plugin-vue-jsx';

const commonConfig = parseIniFile(
    readFileSync(path.resolve(__dirname, '../../env/.env')).toString()
);
const matchModeConfig = parseIniFile(
    readFileSync(path.resolve(__dirname, `../../env/.env.${process.env.NODE_ENV}`)).toString()
);
const envConfig = { ...commonConfig, ...matchModeConfig };

export default defineConfig({
    plugins: [vue(), vueJsx(), VueDevTools()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
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
