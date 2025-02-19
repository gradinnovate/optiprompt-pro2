
const ADVANCED_TERMS = [
  'therefore', 'however', 'moreover', 'consequently', 'furthermore',
  'nevertheless', 'specifically', 'additionally', 'alternatively',
  'analyze', 'evaluate', 'implement', 'optimize', 'integrate'
];

const LOGICAL_CONNECTORS = [
  'first', 'second', 'third', 'finally',
  'because', 'since', 'as a result',
  'for example', 'such as', 'specifically',
  'in addition', 'furthermore', 'moreover',
  'however', 'on the other hand', 'in contrast',
  'in conclusion', 'to summarize', 'overall'
];


export function calculateHeuristicScore(output: string): number {
  let score = 0;
  
  // 1. 長度得分 (0-40 分)
  const length = output.length;
  let lengthScore = 0;
  if (length >= 200 && length <= 1000) {
    lengthScore = 40 * ((length - 200) / 800);
  } else if (length < 200) {
    lengthScore = (length / 200) * 20;
  } else {
    lengthScore = 40 * (1 - Math.min((length - 1000) / 1000, 0.5));
  }
  
  // 2. 複雜度得分 (0-30 分)
  let complexityScore = 0;
  
  // 2.1 詞彙豐富度 (0-15 分)
  const words = output.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  const vocabularyRichness = uniqueWords.size / words.length;
  complexityScore += Math.min(vocabularyRichness * 20, 15);
  
  // 2.2 專業術語和高級詞彙 (0-15 分)
  const advancedTermCount = ADVANCED_TERMS.reduce((count, term) => 
    count + (output.toLowerCase().includes(term) ? 1 : 0), 0);
  complexityScore += Math.min(advancedTermCount * 1.5, 15);
  
  // 3. 結構得分 (0-30 分)
  let structureScore = 0;
  
  // 3.1 段落結構 (0-10 分)
  const paragraphs = output.split(/\n\s*\n/).filter(p => p.trim());
  const hasParagraphs = paragraphs.length > 1;
  structureScore += hasParagraphs ? Math.min(paragraphs.length * 2, 10) : 0;
  
  // 3.2 列表和格式化元素 (0-10 分)
  const hasNumberedList = /\d+\.\s/.test(output);
  const hasBulletList = /[-•*]\s/.test(output);
  const hasHeaders = /^#+\s|\*\*[\w\s]+\*\*/.test(output);
  structureScore += (hasNumberedList ? 4 : 0) + (hasBulletList ? 3 : 0) + (hasHeaders ? 3 : 0);
  
  // 3.3 邏輯連接詞和過渡詞 (0-10 分)
  const connectorCount = LOGICAL_CONNECTORS.reduce((count, term) => 
    count + (output.toLowerCase().includes(term) ? 1 : 0), 0);
  structureScore += Math.min(connectorCount, 10);
  
  // 計算總分
  score = lengthScore + complexityScore + structureScore;
  
  // 確保分數在 0-100 範圍內
  return Math.min(Math.max(score, 0), 100);
}
