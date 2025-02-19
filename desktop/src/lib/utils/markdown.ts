export function isMarkdown(text: string): boolean {
  // 檢查常見的 Markdown 特徵
  const markdownPatterns = [
    /^#\s/m,                    // 標題
    /^##\s/m,                   // 副標題
    /^###\s/m,                  // 小標題
    /^####\s/m,                 // 小標題
    /\*\*(.*?)\*\*/,           // 粗體
    /\*(.*?)\*/,               // 斜體
    /\[.*?\]\(.*?\)/,          // 連結
    /```[\s\S]*?```/,          // 代碼塊
    /^\s*[-*+]\s/m,            // 無序列表
    /^\s*\d+\.\s/m,            // 有序列表
    /^\s*>\s/m,                // 引用
    /\|.*\|.*\|/,              // 表格
    /^---$/m,                  // 分隔線
    /`.*?`/,                   // 行內代碼
  ];

  return markdownPatterns.some(pattern => pattern.test(text));
} 