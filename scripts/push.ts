import { execSync } from "child_process";

// 获取变更文件列表
function getChangedFiles(): string[] {
  try {
    const output = execSync("git status --porcelain", { encoding: "utf-8" });
    return output
      .split("\n")
      .filter(Boolean)
      .map(line => line.slice(3));
  } catch (e) {
    console.error("获取变更文件失败：", e);
    return [];
  }
}

// 根据文件类型获取提交类型
function getCommitType(file: string): string {
  if (file.endsWith('.mdx')) {
    return 'docs';
  } else if (file.includes('package.json')) {
    return 'feat';
  } else if (file.includes('fix')) {
    return 'fix';
  } else if (file.includes('test')) {
    return 'test';
  } else {
    return 'chore';
  }
}

// 生成提交信息
function getCommitMessage(files: string[]): string {
  if (files.length === 0) {
    return `chore: no changes`;
  }

  // 按提交类型分组
  const groupedFiles = files.reduce((acc, file) => {
    const type = getCommitType(file);
    if (!acc[type]) acc[type] = [];
    acc[type].push(file);
    return acc;
  }, {} as Record<string, string[]>);

  // 生成每个类型的描述
  const descriptions = Object.entries(groupedFiles).map(([type, files]) => {
    const fileCount = files.length;
    const isSingleFile = fileCount === 1;
    const fileList = files
      .map(file => file.split('/').pop() || file)
      .join(', ');

    const description = (() => {
      switch (type) {
        case 'docs':
          return isSingleFile ? '更新文档' : `更新 ${fileCount} 个文档`;
        case 'feat':
          return isSingleFile ? '新增功能' : `新增 ${fileCount} 个功能`;
        case 'fix':
          return isSingleFile ? '修复问题' : `修复 ${fileCount} 个问题`;
        case 'test':
          return isSingleFile ? '更新测试' : `更新 ${fileCount} 个测试`;
        default:
          return isSingleFile ? '更新文件' : `更新 ${fileCount} 个文件`;
      }
    })();

    return `${type}: ${description}\n${fileList}`;
  });

  return `${descriptions.join('\n\n')}

变更文件:
${files.map(file => `- ${file}`).join('\n')}`;
}

function main() {
  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0) {
    console.log("没有检测到变更，无需提交。");
    return;
  }

  try {
    execSync("git add .", { stdio: "inherit" });
    const msg = getCommitMessage(changedFiles);
    execSync(`git commit -m "${msg}"`, { stdio: "inherit" });
    execSync("git push", { stdio: "inherit" });
    console.log("已自动提交并推送到远程仓库。");
  } catch (e) {
    console.error("自动提交或推送失败：", e);
    process.exit(1);
  }
}

main();