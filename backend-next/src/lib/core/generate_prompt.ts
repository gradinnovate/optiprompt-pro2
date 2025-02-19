import { chatCompletion } from '../chat';
import { ChatRequest } from '../../types/chat';
import { promptTemplate } from './prompt_template';
import { formatGptResponse } from './utils';
import { CoreApiResponse, PromptOptimizationResponse } from './api';



export async function generateInitialPrompt(
  taskDescription: string,
  initialPrompt: string
): Promise<CoreApiResponse<PromptOptimizationResponse>> {
  try {
    const request: ChatRequest = {
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
    };

    const response = await chatCompletion(request);
    const optimizedPrompt = formatGptResponse(response.message.content)[0];

    return {
      status: 'success',
      type: 'prompt_optimization',
      data: { optimizedPrompt }
    };
  } catch (error) {
    return {
      status: 'error',
      type: 'prompt_optimization',
      data: { optimizedPrompt: '' }
    };
  }
}
