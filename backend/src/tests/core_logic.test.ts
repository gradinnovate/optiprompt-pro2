import { optimizePrompt } from '../lib/core/core_logic';
import { config } from 'dotenv';

// 載入環境變量
config();

describe('optimizePrompt', () => {
  it('should optimize translation prompt with example (Mode 1)', async () => {
    const taskDescription = 'Translate text from Chinese to English';
    const initialPrompt = 'Please translate the following text to English, maintaining a natural and fluent style:';
    const example = '我很喜歡在公園裡散步，尤其是在春天的時候。';

    const response = await optimizePrompt(taskDescription, initialPrompt, example);
    console.log('Translation optimization result:', JSON.stringify(response.data, null, 2));

    expect(response.status).toBe('success');
    expect(response.type).toBe('prompt_optimization');
    
    // Mode 1 特有的屬性
    expect(response.data.critiqueFeedback).toBeTruthy();
    expect(response.data.refinedPrompts).toBeTruthy();
    expect(response.data.refinedPrompts!.length).toBeGreaterThan(0);
    
    // 共同屬性
    expect(response.data.optimizedPrompt).toBeTruthy();
    expect(response.data.variants.length).toBeGreaterThan(0);
    
    // 檢查輸出和分數
    const outputs = response.data.outputs;
    const scores = response.data.scores;
    expect(Object.keys(outputs).length).toBeGreaterThan(0);
    expect(Object.keys(scores).length).toBe(Object.keys(outputs).length);
  }, 60000);

  it('should optimize story generation prompt without example (Mode 2)', async () => {
    const taskDescription = 'Generate a short story about a specific topic';
    const initialPrompt = 'Write a story about a cat who discovers it can fly';

    const response = await optimizePrompt(taskDescription, initialPrompt);
    console.log('Story generation optimization result:', JSON.stringify(response.data, null, 2));

    expect(response.status).toBe('success');
    expect(response.type).toBe('prompt_optimization');
    
    // Mode 2 不應該有的屬性
    expect(response.data.critiqueFeedback).toBeUndefined();
    expect(response.data.refinedPrompts).toBeUndefined();
    
    // 共同屬性
    expect(response.data.optimizedPrompt).toBeTruthy();
    expect(response.data.variants.length).toBeGreaterThan(0);
    
    // 檢查輸出和分數
    const outputs = response.data.outputs;
    const scores = response.data.scores;
    const totalPrompts = 1 + response.data.variants.length; // optimizedPrompt + variants
    expect(Object.keys(outputs).length).toBe(totalPrompts);
    expect(Object.keys(scores).length).toBe(totalPrompts);
  }, 40000);
}); 