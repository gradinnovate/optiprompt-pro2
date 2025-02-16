import { promptTemplate } from './core/prompt_template';

// API Response Types
interface ApiResponse<T> {
  status: 'success' | 'error';
  type: ResponseType;
  data: T;
}

type ResponseType = 
  | 'prompt_optimization'
  | 'llm_output'
  | 'critique_feedback'
  | 'refined_prompt'
  | 'prompt_variants'
  | 'variant_results'
  | 'best_prompt';

interface PromptOptimizationResponse {
  optimizedPrompt: string;
}

interface LlmOutputResponse {
  llmOutput: string;
}

interface CritiqueFeedbackResponse {
  critiqueFeedback: string;
}

interface RefinedPromptResponse {
  refinedPrompts: string[];
}

interface PromptVariantsResponse {
  variants: string[];
}

interface VariantResult {
  variant: string;
  output: string;
  score: number;
}

interface VariantResultsResponse {
  variantResults: VariantResult[];
}

interface BestPromptResponse {
  bestPrompt: string;
}

// Core Logic Class
export class CoreLogic {
  private ollama: Ollama;
  private model: string;

  constructor(baseUrl: string, model: string) {
    this.ollama = new Ollama({ host: baseUrl });
    this.model = model;
  }

  // Utility function to format GPT responses
  private formatGptResponse(content: string): string[] {
    // Match all content between <START> and <END> tags
    const matches = content.match(/<START>([\s\S]*?)<END>/g);
    if (!matches) return [content];
    
    // Extract the content between tags and clean it up
    return matches.map(match => {
      const innerContent = match.replace(/<START>/, '').replace(/<END>/, '').trim();
      return innerContent;
    });
  }

  // (1) Generate Initial Prompt
  async generateInitialPrompt(
    taskDescription: string,
    initialPrompt: string
  ): Promise<ApiResponse<PromptOptimizationResponse>> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: promptTemplate.system_prompt
            },
            {
              role: 'user',
              content: promptTemplate.initial_prompt_generation_template
                .replace('{taskDescription}', taskDescription)
                .replace('{initialPrompt}', initialPrompt)
            }
          ]
        })
      });

      const data = await response.json();
      const optimizedPrompt = this.formatGptResponse(data.message.content)[0];
      return {
        status: 'success',
        type: 'prompt_optimization',
        data: { optimizedPrompt: optimizedPrompt }
      };
    } catch (error) {
      console.error('Error generating initial prompt:', error);
      throw error;
    }
  }

  // (2) Test Prompt on Local LLM
  async testPromptOnLLM(
    optimizedPrompt: string,
    extraInput?: string
  ): Promise<ApiResponse<LlmOutputResponse>> {
    try {
      // Combine optimized prompt with extra input if provided
      const finalPrompt = extraInput 
        ? optimizedPrompt.replace('{_input_}', extraInput)
        : optimizedPrompt;

      const response = await this.ollama.chat({
        model: this.model,
        messages: [{ role: 'user', content: finalPrompt }]
      });
      // Remove <think>...</think> tags from response content if present
      const content = response.message.content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      response.message.content = content;

      return {
        status: 'success',
        type: 'llm_output',
        data: { llmOutput: response.message.content }
      };
    } catch (error) {
      console.error('Error testing prompt on LLM:', error);
      throw error;
    }
  }

  // (3) Generate Critique
  async critiquePrompt(
    optimizedPrompt: string,
    llmOutput: string
  ): Promise<ApiResponse<CritiqueFeedbackResponse>> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: promptTemplate.system_prompt
            },
            {
              role: 'user',
              content: promptTemplate.meta_critique_template
                .replace('{instruction}', optimizedPrompt)
                .replace('{_examples_}', llmOutput)
            }
          ]
        })
      });

      const data = await response.json();
      console.log("critiqueFeedback", data.message.content);
      return {
        status: 'success',
        type: 'critique_feedback',
        data: { critiqueFeedback: this.formatGptResponse(data.message.content).join('\n\n') }
      };
    } catch (error) {
      console.error('Error generating critique:', error);
      throw error;
    }
  }


  // (4) Generate Prompt Variants
  async generatePromptVariants(
    refinedPrompt: string,
    taskDescription: string
  ): Promise<ApiResponse<PromptVariantsResponse>> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: promptTemplate.system_prompt
            },
            {
              role: 'user',
              content: promptTemplate.meta_sample_template
                .replace('{task_description}', taskDescription)
                .replace('{meta_prompts}', promptTemplate.thinking_styles.slice(0, 10).join('\n'))
                .replace('{num_variations}', '5')
                .replace('{prompt_instruction}', refinedPrompt)
            }
          ]
        })
      });

      const data = await response.json();
      const variants = this.formatGptResponse(data.message.content);
      return {
        status: 'success',
        type: 'prompt_variants',
        data: { variants }
      };
    } catch (error) {
      console.error('Error generating prompt variants:', error);
      throw error;
    }
  }

  // (5) Refine Prompt
  async refinePrompt(
    optimizedPrompt: string,
    critique: string,
    examples?: string
  ): Promise<ApiResponse<RefinedPromptResponse>> {
    try {
      const template = examples 
        ? promptTemplate.critique_refine_template.replace('{_examples_}', examples)
        : promptTemplate.critique_refine_template;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: promptTemplate.system_prompt
            },
            {
              role: 'user',
              content: template
                .replace('{instruction}', optimizedPrompt)
                .replace('{critique}', critique)
                .replace('{steps_per_sample}', '3')
            }
          ]
        })
      });

      const data = await response.json();
      //console.log("refinedPrompts(before format)", data.message.content);
      const refinedPrompts = this.formatGptResponse(data.message.content);
      //console.log("refinedPrompts(after format)", refinedPrompts);
      return {
        status: 'success',
        type: 'refined_prompt',
        data: { refinedPrompts: refinedPrompts }
      };
    } catch (error) {
      console.error('Error refining prompt:', error);
      throw error;
    }
  }

  // Helper method to calculate variant score using ChatGPT
  private async calculateGptScore(variant: string, output: string, taskDescription: string): Promise<number> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert evaluator who scores the quality of LLM outputs. Score the output based on the following criteria:

1. Content Quality (0-40 points):
- Relevance to the task
- Accuracy and correctness
- Depth and comprehensiveness
- Information density

2. Language Complexity (0-30 points):
- Vocabulary richness
- Sentence structure variety
- Use of professional terminology
- Clarity and precision

3. Structure and Organization (0-30 points):
- Logical flow and coherence
- Proper formatting and layout
- Use of paragraphs and sections
- Transitional elements

Provide your evaluation in the following format:
<SCORE>
content_quality: [score]
language_complexity: [score]
structure_organization: [score]
total: [total_score]
</SCORE>

<REASON>
Brief explanation of the scoring (2-3 sentences)
</REASON>`
            },
            {
              role: 'user',
              content: `Task Description: ${taskDescription}

Prompt Used: ${variant}

Output to Evaluate: ${output}

Please evaluate the output and provide scores.`
            }
          ]
        })
      });

      const data = await response.json();
      const content = data.message.content;
      
      // Extract score from response
      const scoreMatch = content.match(/<SCORE>[\s\S]*?total: (\d+)[\s\S]*?<\/SCORE>/);
      if (scoreMatch && scoreMatch[1]) {
        return parseInt(scoreMatch[1]);
      }
      
      // Return heuristic score as fallback
      return this.calculateHeuristicScore(output);
    } catch (error) {
      console.error('Error calculating GPT score:', error);
      // Fallback to heuristic scoring if GPT scoring fails
      return this.calculateHeuristicScore(output);
    }
  }

  // Rename the original scoring method
  private calculateHeuristicScore(output: string): number {
    let score = 0;
    
    // 1. 長度得分 (0-40 分)
    // 設定理想長度範圍為 200-1000 字元
    const length = output.length;
    let lengthScore = 0;
    if (length >= 200 && length <= 1000) {
      // 在理想範圍內，按比例給分
      lengthScore = 40 * ((length - 200) / 800);
    } else if (length < 200) {
      // 過短的文本給予較低分數
      lengthScore = (length / 200) * 20;
    } else {
      // 過長的文本給予懲罰
      lengthScore = 40 * (1 - Math.min((length - 1000) / 1000, 0.5));
    }
    
    // 2. 複雜度得分 (0-30 分)
    let complexityScore = 0;
    
    // 2.1 詞彙豐富度 (0-15 分)
    const words = output.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const vocabularyRichness = uniqueWords.size / words.length; // Type-Token Ratio (TTR)
    complexityScore += Math.min(vocabularyRichness * 20, 15);
    
    // 2.2 專業術語和高級詞彙 (0-15 分)
    const advancedTerms = [
      'therefore', 'however', 'moreover', 'consequently', 'furthermore',
      'nevertheless', 'specifically', 'additionally', 'alternatively',
      'analyze', 'evaluate', 'implement', 'optimize', 'integrate'
    ];
    const advancedTermCount = advancedTerms.reduce((count, term) => 
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
    const logicalConnectors = [
      'first', 'second', 'third', 'finally',
      'because', 'since', 'as a result',
      'for example', 'such as', 'specifically',
      'in addition', 'furthermore', 'moreover',
      'however', 'on the other hand', 'in contrast',
      'in conclusion', 'to summarize', 'overall'
    ];
    const connectorCount = logicalConnectors.reduce((count, term) => 
      count + (output.toLowerCase().includes(term) ? 1 : 0), 0);
    structureScore += Math.min(connectorCount, 10);
    
    // 計算總分
    score = lengthScore + complexityScore + structureScore;
    
    // 確保分數在 0-100 範圍內
    return Math.min(Math.max(score, 0), 100);
  }

  // (6) Test Prompt Variants with hybrid scoring
  async testPromptVariants(
    variants: string[],
    extraInput?: string
  ): Promise<ApiResponse<VariantResultsResponse>> {
    try {
      // First, test all variants with heuristic scoring
      const initialResults = await Promise.all(
        variants.map(async (variant) => {
          const finalPrompt = extraInput
            ? variant + '\n' + extraInput
            : variant;

          const response = await this.ollama.chat({
            model: this.model,
            messages: [{ role: 'user', content: finalPrompt }]
          });
          
          const content = response.message.content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
          response.message.content = content;

          // Initial scoring using heuristic method
          const heuristicScore = this.calculateHeuristicScore(content);

          return {
            variant,
            output: content,
            score: heuristicScore,
            initialScore: heuristicScore
          };
        })
      );

      // Sort by initial scores and select top performers for GPT evaluation
      const sortedResults = initialResults.sort((a, b) => b.initialScore - a.initialScore);
      const topVariants = sortedResults.slice(0, 2); // Evaluate top 2 variants with GPT

      // Perform GPT scoring for top variants
      const finalResults = await Promise.all(
        sortedResults.map(async (result) => {
          if (topVariants.includes(result)) {
            // Use GPT scoring for top variants
            const gptScore = await this.calculateGptScore(
              result.variant,
              result.output,
              extraInput || ''
            );
            return {
              variant: result.variant,
              output: result.output,
              score: gptScore
            };
          } else {
            // Keep heuristic score for other variants
            return {
              variant: result.variant,
              output: result.output,
              score: result.initialScore
            };
          }
        })
      );

      return {
        status: 'success',
        type: 'variant_results',
        data: { variantResults: finalResults }
      };
    } catch (error) {
      console.error('Error testing prompt variants:', error);
      throw error;
    }
  }

  // (7) Select Best Prompt
  async selectBestPrompt(
    variantResults: VariantResult[]
  ): Promise<ApiResponse<BestPromptResponse>> {
    try {
      // Sort variants by score in descending order
      const sortedVariants = [...variantResults].sort((a, b) => b.score - a.score);
      const bestVariant = sortedVariants[0];

      return {
        status: 'success',
        type: 'best_prompt',
        data: { bestPrompt: bestVariant.variant }
      };
    } catch (error) {
      console.error('Error selecting best prompt:', error);
      throw error;
    }
  }
} 