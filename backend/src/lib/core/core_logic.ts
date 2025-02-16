import { generateInitialPrompt } from './generate_prompt';
import { critiqueGenerate } from './critique';
import { generatePromptVariants } from './generate_variants';
import { refinePrompt } from './refine_prompt';
import { calculateGptScore } from './scoring';
import { chatCompletion } from '../chat';
import { ChatRequest } from '../../types/chat';
import { CoreApiResponse } from './api';

export interface OptimizationResult {
  optimizedPrompt: string;
  critiqueFeedback?: string;
  refinedPrompts?: string[];
  variants: string[];
  outputs: { [key: string]: string };
  scores: { [key: string]: number };
}

interface PromptOptimizationContext {
  taskDescription: string;
  optimizedPrompt: string;
  refinedPrompts: string[];
  critiqueFeedback: string;
  variants: string[];
  outputs: { [key: string]: string };
  scores: { [key: string]: number };
}

async function generateOutput(prompt: string, example?: string): Promise<string> {
  const request: ChatRequest = {
    messages: [
      {
        role: 'user',
        content: example 
          ? `${prompt}\n\n ${example}`  // 有 example 時，將其作為輸入
          : prompt                            // 沒有 example 時，直接使用 prompt
      }
    ]
  };

  const response = await chatCompletion(request);
  return response.message.content;
}

async function performAdvancedOptimization(
  context: PromptOptimizationContext,
  example: string
): Promise<void> {
  // 1. 生成批評反饋
  const critique = await critiqueGenerate(context.optimizedPrompt, example);
  if (critique.status === 'error') {
    throw new Error('Failed to generate critique');
  }
  context.critiqueFeedback = critique.data.critiqueFeedback;

  // 2. 根據批評優化提示詞
  const refinement = await refinePrompt(context.optimizedPrompt, context.critiqueFeedback);
  if (refinement.status === 'error') {
    throw new Error('Failed to refine prompt');
  }
  context.refinedPrompts = refinement.data.refinedPrompts;

  // 3. 為每個優化後的提示詞生成變體
  const variantsPromises = [
    generatePromptVariants(context.optimizedPrompt, context.taskDescription),
    ...context.refinedPrompts.map(prompt => 
      generatePromptVariants(prompt, context.taskDescription)
    )
  ];

  const variantsResults = await Promise.all(variantsPromises);
  for (const result of variantsResults) {
    if (result.status === 'success') {
      context.variants = [...context.variants, ...result.data.variants];
    }
  }
}

async function performBasicOptimization(
  context: PromptOptimizationContext
): Promise<void> {
  const variants = await generatePromptVariants(context.optimizedPrompt, context.taskDescription);
  if (variants.status === 'success') {
    context.variants = variants.data.variants;
  }
}

async function generateAllOutputs(
  context: PromptOptimizationContext,
  example?: string
): Promise<void> {
  const allPrompts = [
    context.optimizedPrompt,
    ...(context.refinedPrompts || []),
    ...context.variants
  ];

  const outputPromises = allPrompts.map(prompt =>
    generateOutput(prompt, example)  // 傳入 example（如果有的話）
      .then(output => ({ prompt, output }))
  );

  const outputResults = await Promise.all(outputPromises);
  outputResults.forEach(({ prompt, output }) => {
    context.outputs[prompt] = output;
  });
}

async function calculateScores(
  context: PromptOptimizationContext,
  example?: string
): Promise<void> {
  const allPrompts = [
    context.optimizedPrompt,
    ...(context.refinedPrompts || []),
    ...context.variants
  ];

  const scorePromises = allPrompts.map(prompt => {
    if (example) {
      // Mode 1: 使用 prompt + example 作為完整提示詞來評分
      const fullPrompt = `${prompt}\n\n ${example}`;
      return calculateGptScore(fullPrompt, context.outputs[prompt], context.taskDescription)
        .then(score => ({ prompt, score }));
    } else {
      // Mode 2: 直接使用 prompt 評分
      return calculateGptScore(prompt, context.outputs[prompt], context.taskDescription)
        .then(score => ({ prompt, score }));
    }
  });

  const scoreResults = await Promise.all(scorePromises);
  scoreResults.forEach(({ prompt, score }) => {
    context.scores[prompt] = score;
  });
}

export async function optimizePrompt(
  taskDescription: string,
  initialPrompt: string,
  example?: string
): Promise<CoreApiResponse<OptimizationResult>> {
  try {
    // 初始化上下文
    const context: PromptOptimizationContext = {
      taskDescription,
      optimizedPrompt: '',
      refinedPrompts: [],
      critiqueFeedback: '',
      variants: [],
      outputs: {},
      scores: {}
    };

    // 1. 生成初始優化提示詞
    const initialOptimization = await generateInitialPrompt(taskDescription, initialPrompt);
    if (initialOptimization.status === 'error') {
      throw new Error('Failed to generate initial optimization');
    }
    context.optimizedPrompt = initialOptimization.data.optimizedPrompt;

    // 2. 根據模式執行不同的優化流程
    if (example) {
      await performAdvancedOptimization(context, example);
    } else {
      await performBasicOptimization(context);
    }

    // 3. 生成所有提示詞的輸出
    await generateAllOutputs(context, example);

    // 4. 計算所有提示詞的分數，傳入 example 參數
    await calculateScores(context, example);

    return {
      status: 'success',
      type: 'prompt_optimization',
      data: {
        optimizedPrompt: context.optimizedPrompt,
        ...(example ? {
          critiqueFeedback: context.critiqueFeedback,
          refinedPrompts: context.refinedPrompts
        } : {}),
        variants: context.variants,
        outputs: context.outputs,
        scores: context.scores
      }
    };
  } catch (error) {
    console.error('Error in prompt optimization pipeline:', error);
    return {
      status: 'error',
      type: 'prompt_optimization',
      data: {
        optimizedPrompt: initialPrompt,
        variants: [],
        outputs: {},
        scores: {}
      }
    };
  }
} 