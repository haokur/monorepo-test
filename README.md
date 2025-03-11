- npm start 或 npm run dev 启动开发环境
- npm run build 打包
- npm run preview 打包后预览
- npm run clean 清理node_modules和dist

#### 备注

- nodemon 使用3.1.4版本，更高的版本nodemon(config)提示方法不存在
- chalk 使用4版本，更高的版本不支持import导入
- vscode中格式化失效，安装prettier的依赖：pnpm i prettier prettier-eslint --save-dev -w
- 在 pnpm 的仓库中，在项目根目录安装依赖，使用：-w 参数
