export interface PromptVariant {
  variant: string;
  output: string;
  score: number;
}

export interface Prompt {
  id: string;
  uid: string;
  taskType: string;
  model: string;
  taskDescription: string;
  initialPrompt: string;
  extraInput?: string;
  optimizedPrompt?: string;
  llmOutput?: string;
  critiqueFeedback?: string;
  promptVariants?: PromptVariant[];
  finalPrompt?: string;
  finalScore?: number;
  createdAt: Date;
  updatedAt: Date;
}
