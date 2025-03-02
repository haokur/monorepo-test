/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  base: './',
  resolve: {
    alias: {
      '@mono/utils': resolve(__dirname, '../../packages/utils/dist'),
    },
  },
  build: {
    outDir: './dist',
    copyPublicDir: true,
    sourcemap: true,
  },
});
