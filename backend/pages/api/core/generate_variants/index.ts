import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../../src/lib/auth/verify';
import { generatePromptVariants } from '../../../../src/lib/core/generate_variants';
import { ApiResponse } from '../../../../src/types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // 1. 驗證 token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        error: 'No authorization header'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    await verifyToken(token);

    // 2. 解析請求體
    if (!req.body) {
      return res.status(400).json({
        status: 'error',
        error: 'Missing request body'
      });
    }

    const { prompt, taskDescription } = req.body;
    if (!prompt || !taskDescription) {
      return res.status(400).json({
        status: 'error',
        error: 'Missing required fields'
      });
    }

    // 3. 調用核心邏輯
    const result = await generatePromptVariants(prompt, taskDescription);

    // 4. 返回結果
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in generate_variants API:', error);
    return res.status(500).json({
      status: 'error',
      error: 'Internal server error'
    });
  }
} 