import { generatePromptVariants } from '../lib/core/generate_variants';
import { config } from 'dotenv';

// 載入環境變量
config();

describe('generatePromptVariants', () => {
  it('should generate variants for a simple prompt', async () => {
    const refinedPrompt = 'Compare two numbers and determine which is larger';
    const taskDescription = 'Number comparison task';

    const response = await generatePromptVariants(refinedPrompt, taskDescription);
    console.log('Generated variants:', response.data.variants);

    expect(response.status).toBe('success');
    expect(response.type).toBe('prompt_variants');
    expect(response.data.variants.length).toBeGreaterThan(0);
    expect(response.data.variants.length).toBeLessThanOrEqual(5);
  });

  it('should generate variants for a complex prompt', async () => {
    const refinedPrompt = 'Analyze the given mathematical expression and provide a step-by-step solution';
    const taskDescription = 'Mathematical expression evaluation with detailed steps';

    const response = await generatePromptVariants(refinedPrompt, taskDescription);
    console.log('Complex variants:', response.data.variants);

    expect(response.status).toBe('success');
    expect(response.type).toBe('prompt_variants');
    expect(response.data.variants.length).toBeGreaterThan(0);
    expect(response.data.variants.length).toBeLessThanOrEqual(5);
  });
}); 