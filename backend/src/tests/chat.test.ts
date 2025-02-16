import { chatCompletion } from '../lib/chat';
import { ChatRequest } from '../types/chat';
import { config } from 'dotenv';

// 載入環境變量
config();

describe('chatCompletion', () => {
  it('should return a valid chat response', async () => {
    const request: ChatRequest = {
      messages: [{
        role: 'user',
        content: 'which number is the largest, 8.9 and 8.10?'
      }]
    };

    const response = await chatCompletion(request);
    console.log('Chat response:', response);

    expect(response).toHaveProperty('message');
    expect(response.message).toHaveProperty('role');
    expect(response.message).toHaveProperty('content');
  });
}); 