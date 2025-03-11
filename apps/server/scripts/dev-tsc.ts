import ChildProcess, { spawn } from 'child_process';
import Chalk from 'chalk';
import Path from 'path';
import Chokidar from 'chokidar';

const sourceDir = Path.resolve(__dirname, '../src');

function compileTs(directory: string) {
    return new Promise((resolve, reject) => {
        const tscProcess = ChildProcess.exec('tsc', {
            cwd: directory,
        });

        if (!tscProcess.stdout) return;
        tscProcess.stdout.on('data', (data) =>
            process.stdout.write(Chalk.yellowBright(`[tsc] `) + Chalk.white(data.toString()))
        );

        tscProcess.on('exit', (exitCode: number) => {
            if (exitCode > 0) {
                reject(exitCode);
            } else {
                resolve(true);
            }
        });
    });
}

function startServer(filePath: string) {
    const proc = spawn('node', [filePath], { stdio: 'inherit' });
    return proc;
}

let nodeServer: any = null;
async function restartServer() {
    try {
        await compileTs(sourceDir);
        if (nodeServer) {
            nodeServer.kill(); // 终止旧的进程
        }
        // 启动服务
        nodeServer = startServer(Path.resolve(__dirname, '../dist/main.js'));
    } catch {
        console.log(
            Chalk.redBright('Could not start Electron because of the above typescript error(s).')
        );
    }
}
async function start() {
    restartServer();

    Chokidar.watch(sourceDir, {
        cwd: sourceDir,
    }).on('change', (path) => {
        console.log(Chalk.blueBright(`[server] `) + `Change in ${path}. reloading... 🚀`);
        restartServer();
    });
}

start();
