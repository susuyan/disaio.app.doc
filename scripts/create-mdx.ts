import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DOCS_DIR = path.join(__dirname, '../content/docs');

async function main() {
  try {
    // 获取文件名
    const fileName = await new Promise<string>((resolve) => {
      rl.question('请输入要创建的MDX文件名(不需要扩展名): ', resolve);
    });
    
    // 获取文件标题
    const title = await new Promise<string>((resolve) => {
      rl.question('请输入文档标题: ', resolve);
    });
    
    const filePath = path.join(DOCS_DIR, `${fileName}.mdx`);
    
    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
      console.error(`文件 ${filePath} 已存在!`);
      process.exit(1);
    }
    
    // 创建MDX文件内容
    const content = `---
title: ${title}
---

在这里开始编写你的文档内容...
`;
    
    // 写入文件
    fs.writeFileSync(filePath, content);
    console.log(`成功创建MDX文件: ${filePath}`);
    
  } catch (error) {
    console.error('创建MDX文件时出错:', error);
  } finally {
    rl.close();
  }
}

main();