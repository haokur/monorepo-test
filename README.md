- npm start 或 npm run dev 启动开发环境
- npm run build 打包
- npm run preview 打包后预览
- npm run clean 清理node_modules和dist


#### 备注
- nodemon 使用3.1.4版本，更高的版本nodemon(config)提示方法不存在
- 依赖package/utils里的包，首次npm run dev有问题，即使配置了dependsOn的@mono/utils#build