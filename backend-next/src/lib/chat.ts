import { openai, defaultModel, defaultMaxTokens } from '../lib/openai';

import { ChatMessage, ChatRequest, ChatResponse } from '../types/chat';

export async function chatCompletion(request: ChatRequest): Promise<ChatResponse> {
    try {
        const completion = await openai.chat.completions.create({
            model: defaultModel,
            messages: request.messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            max_completion_tokens: defaultMaxTokens,
            stream: false,
          });
      
        const responseMessage = completion.choices[0].message;
             
        const response: ChatResponse = {
            message: {
              role: responseMessage.role as ChatMessage['role'],
              content: responseMessage.content ?? '',
            },
        };
      
        return response;
    } catch (error) {
        // 只在非測試環境輸出錯誤
        if (process.env.NODE_ENV !== 'test') {
            console.error('Error in chat completion:', error);
        }
        throw error;
    }
}
