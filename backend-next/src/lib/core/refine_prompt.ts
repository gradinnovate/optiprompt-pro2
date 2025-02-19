import { chatCompletion } from '../chat';
import { ChatRequest } from '../../types/chat';
import { promptTemplate } from './prompt_template';
import { formatGptResponse } from './utils';
import { CoreApiResponse, RefinedPromptResponse } from './api';

export async function refinePrompt(
  optimizedPrompt: string,
  critique: string,
  examples?: string
): Promise<CoreApiResponse<RefinedPromptResponse>> {
  try {
    const template = examples 
      ? promptTemplate.critique_refine_template.replace('{_examples_}', examples)
      : promptTemplate.critique_refine_template;

    const request: ChatRequest = {
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
    };

    const response = await chatCompletion(request);
    const refinedPrompts = formatGptResponse(response.message.content);

    return {
      status: 'success',
      type: 'refined_prompt',
      data: { refinedPrompts }
    };
  } catch (error) {
    return {
      status: 'error',
      type: 'refined_prompt',
      data: { refinedPrompts: [] }
    };
  }
}
