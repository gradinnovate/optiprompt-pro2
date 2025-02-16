import { calculateHeuristicScore, calculateGptScore } from '../lib/core/scoring';
import { config } from 'dotenv';

// 載入環境變量
config();

describe('calculateGptScore', () => {
  it('should calculate score for simple output', async () => {
    const variant = 'Compare two numbers and determine which is larger';
    const output = '8.10 is larger than 8.9 because when comparing decimal numbers, we need to look at each decimal place. In this case, 8.10 equals 8.1, which is greater than 8.9.';
    const taskDescription = 'Number comparison task';

    const score = await calculateGptScore(variant, output, taskDescription);
    console.log('Simple output score:', score);

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should calculate score for complex output', async () => {
    const variant = 'Analyze the given mathematical expression and provide a step-by-step solution';
    const output = `Let's solve (15 / 3) + 4 * 2 step by step:

1. First, follow PEMDAS (Parentheses, Exponents, Multiplication/Division from left to right, Addition/Subtraction from left to right)
2. Start with division in parentheses: 15 / 3 = 5
3. Now we have: 5 + 4 * 2
4. Next, multiplication: 4 * 2 = 8
5. Finally, addition: 5 + 8 = 13

Therefore, (15 / 3) + 4 * 2 = 13`;
    const taskDescription = 'Mathematical expression evaluation with detailed steps';

    const score = await calculateGptScore(variant, output, taskDescription);
    console.log('Complex output score:', score);

    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should handle heuristic scoring for structured output', async () => {
    const variant = 'Explain the process of photosynthesis';
    const output = `Let's analyze the process of photosynthesis step by step:

1. First, plants absorb sunlight through chlorophyll in their leaves.
2. Moreover, they take in carbon dioxide through tiny pores.
3. Additionally, water is absorbed through the roots.

Therefore, through these components, plants can produce:
• Glucose (sugar)
• Oxygen as a byproduct

In conclusion, photosynthesis is a complex but essential process for life on Earth.`;

    const score = await calculateGptScore(variant, output, 'Biology explanation');
    console.log('gpt score for structured output:', score);

    expect(score).toBeGreaterThan(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should handle heuristic scoring for simple output', async () => {
    const variant = 'What is 2+2?';
    const output = 'The answer is 4.';

    const score = await calculateGptScore(variant, output, 'Basic math');
    console.log('gpt score for simple output:', score);

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });
}); 