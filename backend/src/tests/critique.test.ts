import { critiqueGenerate } from '../lib/core/critique';
import { config } from 'dotenv';
import handler from '../../pages/api/core/critique';

// 載入環境變量
config();

describe('critiqueGenerate', () => {
  it('should generate critique feedback for prompt and output', async () => {
    const optimizedPrompt = 'Compare the following two numbers and determine which one is larger: {num1} and {num2}';
    const llmOutput = `Test Case 1:
Input: 8.9 and 8.10
Expected: 8.10 is larger
Actual: 8.9 is larger

Test Case 2:
Input: 10.01 and 10.1
Expected: 10.1 is larger
Actual: Unclear response`;

    const response = await critiqueGenerate(optimizedPrompt, llmOutput);
    console.log('Critique feedback:', response.data.critiqueFeedback);

    expect(response.status).toBe('success');
    expect(response.type).toBe('critique_feedback');
    expect(response.data.critiqueFeedback).toBeTruthy();
    expect(response.data.critiqueFeedback.length).toBeGreaterThan(0);
  });

  it('should handle complex test cases', async () => {
    const optimizedPrompt = 'Analyze the given mathematical expression and evaluate its result with step-by-step explanation';
    const llmOutput = `Test Case 1:
Input: 2 * (3 + 4) - 5
Expected: Step 1: 3 + 4 = 7
         Step 2: 2 * 7 = 14
         Step 3: 14 - 5 = 9
Actual: Directly gave answer 9 without steps

Test Case 2:
Input: (15 / 3) + 4 * 2
Expected: Follow order of operations (PEMDAS)
Actual: Calculated from left to right`;

    const response = await critiqueGenerate(optimizedPrompt, llmOutput);
    console.log('Complex critique feedback:', response.data.critiqueFeedback);

    expect(response.status).toBe('success');
    expect(response.type).toBe('critique_feedback');
    expect(response.data.critiqueFeedback.length).toBeGreaterThan(100);
  });
});

describe('critique API', () => {
  it('should handle critique request', async () => {
    // 模擬 Next.js API request 和 response
    const req = {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test-token'
      },
      body: {
        prompt: 'test prompt',
        example: 'test example'
      }
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;

    // 調用 handler
    await handler(req, res);

    // 驗證響應
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success'
      })
    );
  });
}); 