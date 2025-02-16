import { generateInitialPrompt } from '../lib/core/generate_prompt';
import { config } from 'dotenv';

// 載入環境變量
config();

describe('generateInitialPrompt', () => {
  it('should optimize a simple prompt', async () => {
    const taskDescription = 'Compare two numbers';
    const initialPrompt = 'which number is larger?';

    const response = await generateInitialPrompt(taskDescription, initialPrompt);
    console.log('Simple prompt optimization:', response.data.optimizedPrompt);

    expect(response.status).toBe('success');
    expect(response.type).toBe('prompt_optimization');
    expect(response.data.optimizedPrompt).toBeTruthy();
  });

  it('should optimize a complex prompt', async () => {
    const taskDescription = 'Create a detailed product description for an e-commerce platform';
    const initialPrompt = 'Write about this product in detail: {product_name}';

    const response = await generateInitialPrompt(taskDescription, initialPrompt);
    console.log('Complex prompt optimization:', response.data.optimizedPrompt);

    expect(response.status).toBe('success');
    expect(response.type).toBe('prompt_optimization');
    expect(response.data.optimizedPrompt.length).toBeGreaterThan(initialPrompt.length);
  });

}); 