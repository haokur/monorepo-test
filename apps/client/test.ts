// import copy from 'esbuild-plugin-copy';

import { copy } from 'fs-extra';
import path from 'path';

async function copyStaticAssets() {
    const srcDir = path.resolve(__dirname, 'src/static'); // 原始静态文件夹
    const destDir = path.resolve(__dirname, 'dist', 'static'); // 输出到dist
    await copy(srcDir, destDir);
}

copyStaticAssets();
