const fs = require("fs");
const JSZip = require("jszip");
const xml2js = require("xml2js");

async function convertDocxToHtml(docxPath) {
    const data = fs.readFileSync(docxPath);
    const zip = await JSZip.loadAsync(data);

    // 读取 `word/document.xml`
    const xmlContent = await zip.file("word/document.xml").async("text");

    // 解析 XML
    xml2js.parseString(xmlContent, (err, result) => {
        if (err) {
            console.error("XML 解析失败", err);
            return;
        }

        const paragraphs = result["w:document"]["w:body"][0]["w:p"];
        let htmlOutput = "";

        paragraphs.forEach(p => {
            let text = "";
            let tag = "p"; // 默认是段落

            if (p["w:r"]) {
                text = p["w:r"].map(r => r["w:t"]?.join("") || "").join("");
            }

            if (p["w:pPr"] && p["w:pPr"][0]["w:pStyle"]) {
                const styleVal = p["w:pPr"][0]["w:pStyle"][0]["$"]["w:val"];

                // 根据 Word 样式值转换为 HTML
                switch (styleVal) {
                    case "4": tag = "h1"; break; // 标题1
                    case "6": tag = "h2"; break; // 标题2
                    case "8": tag = "h3"; break; // 标题3
                    case "10": tag = "h4"; break; // 标题4
                    case "12": tag = "h5"; break; // 标题5
                    default: tag = "p"; // 正文
                }
            }

            if (text.trim()) {
                htmlOutput += `<${tag}>${text}</${tag}>\n`;
            }
        });

        console.log(htmlOutput);
    });
}

async function parseDocx(filePath) {
    const data = fs.readFileSync(filePath);
    const zip = await JSZip.loadAsync(data);
    // console.log(zip, "read-docx.js::8行");

    // 读取 `word/document.xml` 文件，这里存放的是文档内容
    const xmlContent = await zip.file("word/document.xml").async("text");
    const styleContent = await zip.file("word/styles.xml").async("text");
    console.log(xmlContent, "read-docx.js::61行");
    fs.writeFileSync('./assets/document.xml',xmlContent)
    xml2js.parseString(xmlContent, (err, result) => {
        console.log(result, "read-docx.js::63行");
    })
    return
    // console.log(xmlContent, "read-docx.js::12行");

    // const htmlResult = await convertDocxToHtml(xmlContent);
    // console.log(htmlResult, "read-docx.js::63行");

    // 解析 XML
    xml2js.parseString(xmlContent, (err, result) => {
        if (err) {
            console.error("XML 解析失败", err);
            return;
        }

        const content = result["w:document"]["w:body"][0]["w:p"]
        content.forEach((row, index) => {
            if (index !== 0) {
                return
            }
            let rowStyles = row["w:pPr"];
            let rowContents = row["w:r"];
            console.log({ rowStyles, rowContents }, "read-docx.js::79行");



            // let stylesList = row["w:pPr"];
            // let contentList = row["w:r"] || [];
            // console.log({ stylesList, contentList }, "read-docx.js::76行");

            // const [rowStyleArr] = stylesList;
            // const [contentItem = [{ "w:t": [] }]] = contentList;

            // const rowStyle = rowStyleArr[0];
            // let rowContents = [];
            // if (contentItem && contentItem["w:t"]) {
            //     // console.log(contentItem, "read-docx.js::84行");
            //     rowContents = contentItem["w:t"][0]
            // }
            // console.log({ stylesList, rowStyle, rowContents }, "read-docx.js::80行");
            // console.log(row, "read-docx.js::74行");
            // Object.keys(row).forEach(key => {
            //     console.log(row[key], "read-docx.js::76行");
            // })
        })
        // 提取所有段落文本
        // const paragraphs = result["w:document"]["w:body"][0]["w:p"];
        // const textContent = paragraphs
        //     .map(p => p["w:r"]?.map(r => r["w:t"]?.join("")).join("") || "")
        //     .join("\n");

        // console.log(textContent);
    });
}

// 调用解析函数
parseDocx("shimo.docx");
