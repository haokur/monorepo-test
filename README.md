- npm start 或 npm run dev 启动开发环境
- npm run build 打包
- npm run preview 打包后预览
- npm run clean 清理node_modules和dist


#### 备注
- nodemon 使用3.1.4版本，更高的版本nodemon(config)提示方法不存在
- `apps/web/vite.config.ts` 中需要配置 alias 才能运行，不够优雅，持续跟进是否有不需要配置alias的方式