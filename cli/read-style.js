const fs = require('fs');
const JSZip = require('jszip');
const xml2js = require('xml2js');

// 解析 .docx 文件
async function parseDocx(filePath) {
    const data = fs.readFileSync(filePath);
    const zip = await JSZip.loadAsync(data);

    // 读取 document.xml（Word 主要内容）
    const docXml = await zip.file("word/document.xml").async("text");
    const stylesXml = await zip.file("word/styles.xml").async("text");

    // 解析 XML
    const docJson = await xml2js.parseStringPromise(docXml);
    const stylesJson = await xml2js.parseStringPromise(stylesXml);

    // 获取所有样式
    const stylesMap = parseStyles(stylesJson);

    // 解析正文并转换为 HTML
    const htmlContent = parseBodyToHtml(docJson, stylesMap);

    return htmlContent;
}

// 解析 word/styles.xml，建立 样式ID => CSS 样式 对应关系
function parseStyles(stylesJson) {
    const stylesMap = {};

    const styles = stylesJson['w:styles']['w:style'] || [];
    styles.forEach(style => {
        const styleId = style['$']['w:styleId'];
        const name = style['w:name'] ? style['w:name'][0]['$']['w:val'] : 'Unknown';
        const css = {};

        // 提取颜色
        if (style['w:rPr'] && style['w:rPr'][0]['w:color']) {
            css.color = `#${style['w:rPr'][0]['w:color'][0]['$']['w:val']}`;
        }

        // 是否加粗
        if (style['w:rPr'] && style['w:rPr'][0]['w:b']) {
            css['font-weight'] = 'bold';
        }

        // 字体大小
        if (style['w:rPr'] && style['w:rPr'][0]['w:sz']) {
            const sizeVal = style['w:rPr'][0]['w:sz'][0]['$']['w:val'];
            css['font-size'] = `${sizeVal / 2}pt`; // Word 中的单位是 1/2 pt
        }

        // 转换为 CSS 字符串
        const cssString = Object.entries(css)
            .map(([key, value]) => `${key}:${value};`)
            .join(' ');

        stylesMap[styleId] = cssString;
    });

    return stylesMap;
}

// 解析 document.xml 并转换为 HTML
function parseBodyToHtml(docJson, stylesMap) {
    const paragraphs = docJson['w:document']['w:body'][0]['w:p'];
    let htmlContent = '';

    paragraphs.forEach(p => {
        let paragraphText = '';

        // 获取段落的样式
        let styleId = null;
        if (p['w:pPr'] && p['w:pPr'][0]['w:pStyle']) {
            styleId = p['w:pPr'][0]['w:pStyle'][0]['$']['w:val'];
        }
        const styleAttr = stylesMap[styleId] ? ` style="${stylesMap[styleId]}"` : '';

        // 解析文本内容
        if (p['w:r']) {
            p['w:r'].forEach(run => {
                if (run['w:t']) {
                    paragraphText += run['w:t'][0];
                }
            });
        }

        // 生成 HTML 段落
        if (paragraphText.trim()) {
            htmlContent += `<p${styleAttr}>${paragraphText}</p>\n`;
        }
    });

    return htmlContent;
}

// 运行解析
parseDocx('shimo.docx')
    .then(html => {
        fs.writeFileSync('output.html', html, 'utf8');
        console.log('✅ 解析完成，HTML 已生成：output.html');
    })
    .catch(err => console.error('❌ 解析失败:', err));
