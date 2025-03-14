import fs from 'fs/promises';
import path from 'path';
import { askByCmd } from './helper/inquirer.helper';

const cleanSelectOptions = ['node_modules', 'dist', '.turbo', 'target', 'index.node'];
const needExcludeDirs = ['node_modules', 'target', '.git', '.history'];

/**
 * 递归删除指定目录下的所有 node_modules 文件夹
 * @param dirPath 要扫描的目录路径
 */
async function deleteDirByDirName(dirPath: string, needDeleteDirName: string): Promise<void> {
    try {
        // 读取目录内容
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const isDirectory = entry.isDirectory();
            const isMatchDeleteDirName = entry.name === needDeleteDirName;

            const isMatchExcludeName = needExcludeDirs.includes(entry.name);
            const isDeleteTargetInExclude = needExcludeDirs.includes(needDeleteDirName);

            // 如果是排除的目录，则跳过（除非要删的目录就是）
            // 比如要删除的是node_modules,除非当前要删的就是node_modules,才能去执行删除
            if (isMatchExcludeName && !isDeleteTargetInExclude) {
                continue;
            }
            if (isMatchDeleteDirName) {
                console.log(`🗑️ 正在删除: ${fullPath}`);
                await fs.rm(fullPath, { recursive: true, force: true });
            } else {
                // 递归扫描子目录
                if (isDirectory) {
                    await deleteDirByDirName(fullPath, needDeleteDirName);
                }
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`❌ 错误在 "${dirPath}": ${error.message}`);
        } else {
            console.error(`❌ 未知错误: ${error}`);
        }
    }
}

// 主函数
async function main() {
    // 获取目标目录，默认为当前工作目录
    const targetDir = process.argv[2] || process.cwd();
    console.log(`🔍 正在扫描目录: ${targetDir}`);

    const userSelectResult = await askByCmd('checkbox', [
        {
            message: '选择要清理的项',
            name: 'cleanOptions',
            choices: cleanSelectOptions,
        },
    ]);
    if (userSelectResult) {
        const cleanOptions = userSelectResult.cleanOptions as string[];
        await Promise.all(cleanOptions.map((dirName) => deleteDirByDirName(targetDir, dirName)));
    }
    console.log('✅ 清理完成');
}

// 执行主函数并捕获错误
main().catch((err) => {
    console.error('❌ 清理失败:', err);
    process.exit(1);
});
