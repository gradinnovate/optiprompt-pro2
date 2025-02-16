import { refinePrompt } from '../lib/core/refine_prompt';
import { config } from 'dotenv';

// 載入環境變量
config();

describe('refinePrompt', () => {
  it('should refine a prompt based on critique', async () => {
    const optimizedPrompt = 'Compare two numbers and tell which is larger';
    const critique = 'The prompt needs to be more specific about handling decimal numbers and equal values';

    const response = await refinePrompt(optimizedPrompt, critique);
    console.log('Refined prompts:', response.data.refinedPrompts);

    expect(response.status).toBe('success');
    expect(response.type).toBe('refined_prompt');
    expect(response.data.refinedPrompts.length).toBeGreaterThan(0);
    expect(response.data.refinedPrompts.length).toBeLessThanOrEqual(3);
  });

  it('should refine a prompt with examples', async () => {
    const optimizedPrompt = 'Solve the math problem step by step';
    const critique = 'The prompt should specify the format for showing work and handling different types of operations';
    const examples = `Example 1: 2 * (3 + 4)
Solution: Show parentheses first, then multiply
Example 2: 15 / 3 + 4
Solution: Division before addition`;

    const response = await refinePrompt(optimizedPrompt, critique, examples);
    console.log('Refined prompts with examples:', response.data.refinedPrompts);

    expect(response.status).toBe('success');
    expect(response.type).toBe('refined_prompt');
    expect(response.data.refinedPrompts.length).toBeGreaterThan(0);
    expect(response.data.refinedPrompts.every(prompt => prompt.includes('step'))).toBe(true);
  });
}); 