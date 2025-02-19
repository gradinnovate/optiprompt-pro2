export interface PromptOptimizationResponse {
    optimizedPrompt: string;
}

export interface CritiqueFeedbackResponse {
    critiqueFeedback: string;
}

export interface PromptVariantsResponse {
    variants: string[];
}

export interface RefinedPromptResponse {
    refinedPrompts: string[];
}
  
  

export type ResponseType = 
| 'prompt_optimization'
| 'critique_feedback'
| 'prompt_variants'
| 'refined_prompt'

export interface CoreApiResponse<T> {
    status: 'success' | 'error';
    type: ResponseType;
    data: T;
}
