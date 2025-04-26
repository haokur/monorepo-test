import esbuild from 'esbuild';
import chokidar from 'chokidar';
import path from 'path';
import childProcess from 'child_process';
import { EOL } from 'os';
const Electron = require('electron');
import chalk from 'chalk';

const sourceDir = path.resolve(__dirname, '../src');

let electronProcess: any = null;
let electronProcessLocker = false;

function logInfo(message: string) {
    console.log(
        `${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} ${chalk.cyan('ℹ️')} ${message}`
    );
}

function logSuccess(message: string) {
    console.log(
        `${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} ${chalk.green('✅')} ${chalk.green(message)}`
    );
}

function logError(message: string) {
    console.error(
        `${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} ${chalk.red('❌')} ${chalk.red(message)}`
    );
}

function logBuildTime(ms: number) {
    console.log(
        `${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} 🚀 构建耗时：${chalk.yellow(`${ms}ms`)}`
    );
}

async function startElectron() {
    if (electronProcess) return;

    const args = ['--disable-gpu', path.resolve(sourceDir, '../dist/main.js')];
    electronProcess = childProcess.spawn(Electron, args);
    electronProcessLocker = false;

    electronProcess.stdout.on('data', (data: any) => {
        if (data == EOL) return;
        process.stdout.write(chalk.gray(`[Electron] `) + data.toString());
    });

    electronProcess.stderr.on('data', (data: any) =>
        process.stderr.write(chalk.red(`[Electron Error] `) + data.toString())
    );

    electronProcess.on('exit', () => stop());
}

function restartElectron() {
    if (electronProcess) {
        electronProcess.removeAllListeners('exit');
        electronProcess.kill();
        electronProcess = null;
    }

    if (!electronProcessLocker) {
        electronProcessLocker = true;
        logInfo('🔁 正在重启 Electron...');
        startElectron();
    }
}

function stop() {
    electronProcess = null;
}

async function startBuild() {
    try {
        logInfo('开始初始化 esbuild...');
        const ctx = await esbuild.context({
            entryPoints: [`${sourceDir}/**/*.ts`], // ✅ 通配符，匹配所有 ts 文件
            outdir: path.resolve(sourceDir, '../dist'),
            bundle: false, // ✅ 不打包，只单文件编译
            platform: 'node',
            target: 'esnext',
            sourcemap: false,
            minify: false,
            format: 'cjs',
            loader: { '.ts': 'ts' },
        });

        const start = Date.now();
        await ctx.rebuild();
        logBuildTime(Date.now() - start);
        logSuccess('初始构建完成！');
        await startElectron();

        // 开始监听变动
        chokidar
            .watch(`${sourceDir}`, {
                cwd: sourceDir,
                ignoreInitial: true, // 忽略首次加入
                awaitWriteFinish: {
                    stabilityThreshold: 2000, // 等待文件稳定 2 秒
                },
            })
            .on('change', async (changedPath) => {
                logInfo(`文件变动：${chalk.yellow(changedPath)}`);
                const start = Date.now();
                try {
                    await ctx.rebuild();
                    logBuildTime(Date.now() - start);
                    logSuccess('构建完成，准备重启 Electron...');
                    restartElectron();
                } catch (err) {
                    logError('构建失败');
                    console.error(err);
                }
            });

        logInfo('👀 监听启动成功，等待文件变更...');
    } catch (err) {
        logError('esbuild 初始化失败');
        console.error(err);
    }
}

startBuild();
