/**dev-server with nodemon.js */
import path from 'path';

import nodemon, { NodemonSettings } from 'nodemon';

interface INodemonConfig extends NodemonSettings {
    /**指定需要监视的目录或文件，可以是数组形式 */
    watch: string[];
    /**忽略的根目录 */
    ignoreRoot: string[];
    /**忽略监视的文件或目录 */
    ignore: string[];
}

export function runDevServer(config: INodemonConfig) {
    let isRunning = false;
    nodemon(config);
    nodemon
        .on('start', function () {
            !isRunning && console.log('========== ⭐️Nodemon watch has started⭐️ =========\n');
            isRunning = true;
        })
        .on('restart', function (files: any) {
            console.log(`\n=======================================`);
            console.log(`restart due to:\n`, files);
            console.log(`=======================================\n`);
        })
        .on('quit', function () {
            console.log('App has quit');
            process.exit();
        });
}

export function startServer() {
    const packageUtilsPath = path.resolve(__dirname, '../../../packages/utils/dist/index.js');
    runDevServer({
        script: path.join(__dirname, '../src/main.ts'),
        watch: ['src', packageUtilsPath],
        ignoreRoot: ['node_modules', '.git'],
        ignore: ['src/test-ignore.ts'],
        delay: 1000,
    });
}

// 因为要动态编译环境变量，使用dev-tsc
// startServer()
