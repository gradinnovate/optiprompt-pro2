import { chatCompletion } from '../chat';
import { ChatRequest } from '../../types/chat';
import { promptTemplate } from './prompt_template';
import { formatGptResponse } from './utils';
import { CoreApiResponse, CritiqueFeedbackResponse } from './api';

export async function critiqueGenerate(
  optimizedPrompt: string,
  examples: string
): Promise<CoreApiResponse<CritiqueFeedbackResponse>> {
  try {
    const chatRequest: ChatRequest = {
      messages: [
        {
          role: 'system',
          content: promptTemplate.system_prompt
        },
        {
          role: 'user',
          content: promptTemplate.meta_critique_template
            .replace('{instruction}', optimizedPrompt)
            .replace('{_examples_}', examples)
        }
      ]
    };

    const response = await chatCompletion(chatRequest);
    const critiqueFeedback = formatGptResponse(response.message.content);

    return {
      status: 'success',
      type: 'critique_feedback',
      data: { 
        critiqueFeedback: critiqueFeedback.join('\n')
      }
    };
  } catch (error) {
    return {
      status: 'error',
      type: 'critique_feedback',
      data: { critiqueFeedback: '' }
    };
  }
}
