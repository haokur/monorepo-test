const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

// 样式映射
const styleMap = `
p[style-name='Title'] => h1:fresh
p[style-name='Subtitle'] => h2:fresh
`;

// 替换映射
const replaceMap = {};

// 自定义替换映射
const docxTransformData = [
    {
        originDocx: 'shimo.docx',
        output: 'shimo.html',
        customReplaceMap: {},
    },
];

// HTML 模板
const htmlTemplate = (htmlContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
  <title>Document</title>
  <style>
    body {
      font-family: PingFang SC;
      font-size: 14px;
      padding: 0 24px;
      margin: 0;
      opacity: 0.9;
      padding-top: 20px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div>
    ${htmlContent}
  </div>
  <script>
    window.onload = function () {
      // 判断是否 Safari 浏览器
      var userAgent = navigator.userAgent;
      if (userAgent.indexOf("Safari") > -1) {
        document.addEventListener('touchstart', function (event) {
          if (event.touches.length > 1) {
            event.preventDefault();
          }
        });
        var lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
          var now = new Date().getTime();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        });
      }
    };
  </script>
</body>
</html>
`;

// 替换 HTML 内容
const replaceHtmlContent = (html, replaceMap) => {
    let updatedHtml = html;
    Object.keys(replaceMap).forEach((key) => {
        if (updatedHtml.includes(key)) {
            updatedHtml = updatedHtml.replace(key, replaceMap[key]);
        }
    });
    return updatedHtml;
};

// 转换 .docx 文件为 HTML
async function transformDocx2Html(fileItem) {
    const { originDocx, output, customReplaceMap } = fileItem;
    const fullPath = path.join(__dirname, originDocx);
    const outputPath = path.join(__dirname, 'output', output);

    try {
        // 检查输出目录是否存在
        await fs.mkdir(path.join(__dirname, 'output'), { recursive: true });

        // 转换 .docx 文件
        const result = await mammoth.convertToHtml({ path: fullPath }, { styleMap });
        let html = result.value;

        // 合并替换映射
        const _replaceMap = { ...replaceMap, ...customReplaceMap };

        // 替换 HTML 内容
        html = replaceHtmlContent(html, _replaceMap);

        // 写入 HTML 文件
        await fs.writeFile(outputPath, htmlTemplate(html));

        console.log(`文件已成功转换并保存到: ${outputPath}`);

        // 处理警告信息
        if (result.messages.length > 0) {
            console.warn('转换消息:');
            result.messages.forEach((message) => console.warn(message));
        }
    } catch (err) {
        console.error(`读取或转换文件 ${originDocx} 时出错:`, err);
    }
}

// 批量处理文件
async function processFiles() {
    for (const item of docxTransformData) {
        await transformDocx2Html(item);
    }
}

// 启动
processFiles();
