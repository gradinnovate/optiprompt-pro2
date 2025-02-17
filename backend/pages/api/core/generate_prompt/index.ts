import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../../src/lib/auth/verify';
import { generateInitialPrompt } from '../../../../src/lib/core/generate_prompt';
import { ApiResponse } from '../../../../src/types/api';
import { corsMiddleware } from '../../../../src/lib/cors';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (corsMiddleware(req, res)) {
    return;
  }

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

    const { taskDescription, initialPrompt } = req.body;
    if (!taskDescription || !initialPrompt) {
      return res.status(400).json({
        status: 'error',
        error: 'Missing required fields'
      });
    }

    // 3. 調用核心邏輯
    const result = await generateInitialPrompt(taskDescription, initialPrompt);

    // 4. 返回結果
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in generate_prompt API:', error);
    return res.status(500).json({ 
      status: 'error',
      error: 'Internal server error' 
    });
  }
} 