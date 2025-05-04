// scripts/format-mdx.ts
import fs from 'fs';
import path from 'path';

/**
 * 格式化 MDX 文件：
 * 1. 整理段落（确保段落间有 1 个空行）
 * 2. 清理文件末尾的多余空白
 * 3. 在中英文之间添加空格（如 "中文English" → "中文 English"）
 */
function formatMdxFile(filePath: string) {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. 中英文空格格式化
    content = content.replace(/([\u4e00-\u9fa5])([a-zA-Z])/g, '$1 $2') // 中文 + 英文 → 中文 + 空格 + 英文
                    .replace(/([a-zA-Z])([\u4e00-\u9fa5])/g, '$1 $2'); // 英文 + 中文 → 英文 + 空格 + 中文

    // 2. 整理段落：将连续多个空行替换为 1 个空行
    content = content.replace(/\n{3,}/g, '\n\n');

    // 3. 清理文件末尾的多余空白（包括换行符和空格）
    content = content.trimEnd() + '\n';

    // 写入格式化后的内容
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Formatted: ${filePath}`);
}

/**
 * 批量处理指定目录下的所有 MDX 文件
 */
function formatMdxFilesInDirectory(dirPath: string) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        if (file.endsWith('.mdx')) {
            formatMdxFile(filePath);
        }
    });
}

// 使用示例：处理 content/docs 目录下的所有 MDX 文件
const targetDir = path.join(__dirname, '../content/docs');
formatMdxFilesInDirectory(targetDir);