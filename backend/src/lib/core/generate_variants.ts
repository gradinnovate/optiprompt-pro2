import { chatCompletion } from '../chat';
import { ChatRequest } from '../../types/chat';
import { promptTemplate } from './prompt_template';
import { formatGptResponse } from './utils';
import { CoreApiResponse, PromptVariantsResponse } from './api';

export async function generatePromptVariants(
  refinedPrompt: string,
  taskDescription: string
): Promise<CoreApiResponse<PromptVariantsResponse>> {
  try {
    const request: ChatRequest = {
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
    };

    const response = await chatCompletion(request);
    const variants = formatGptResponse(response.message.content);

    return {
      status: 'success',
      type: 'prompt_variants',
      data: { variants }
    };
  } catch (error) {
    return {
      status: 'error',
      type: 'prompt_variants',
      data: { variants: [] }
    };
  }
}

