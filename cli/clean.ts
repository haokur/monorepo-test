import fs from 'fs/promises';
import path from 'path';

/**
 * 递归删除指定目录下的所有 node_modules 文件夹
 * @param dirPath 要扫描的目录路径
 */
async function deleteDirByDirName(dirPath: string,needDeleteDirName:string): Promise<void> {
  try {
    // 读取目录内容
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === needDeleteDirName) {
          console.log(`🗑️ 正在删除: ${fullPath}`);
          // 删除 node_modules 目录及其所有内容
          await fs.rm(fullPath, { recursive: true, force: true });
        } else {
          // 递归扫描子目录
          await deleteDirByDirName(fullPath,needDeleteDirName);
        }
      }
      // 如果是文件，则跳过
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

  await deleteDirByDirName(targetDir,'node_modules');
  await deleteDirByDirName(targetDir,'dist');

  console.log('✅ 清理完成');
}

// 执行主函数并捕获错误
main().catch((err) => {
  console.error('❌ 清理失败:', err);
  process.exit(1);
});