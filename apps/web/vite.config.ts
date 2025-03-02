/// <reference types="vite/client" />
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  base: './',
  build: {
    outDir: './dist',
    copyPublicDir: true,
    sourcemap: true,
  },
});
