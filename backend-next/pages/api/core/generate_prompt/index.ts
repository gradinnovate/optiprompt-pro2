import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../../src/lib/auth/verify';
import { generateInitialPrompt } from '../../../../src/lib/core/generate_prompt';
import { ApiResponse } from '../../../../src/types/api';
import { corsMiddleware } from '../../../../src/lib/cors';

/**
 * Generate Initial Prompt API
 * 
 * This API endpoint generates an optimized initial prompt based on a task description and initial prompt.
 * 
 * @route POST /api/core/generate_prompt
 * 
 * @authentication Required - Bearer token must be provided in Authorization header
 * 
 * @body {
 *   taskDescription: string - Description of the task/context for prompt generation
 *   initialPrompt: string - The initial prompt to be optimized
 * }
 * 
 * @returns {
 *   status: 'success' | 'error',
 *   type?: 'prompt_optimization',
 *   data?: {
 *     optimizedPrompt: string - The optimized prompt
 *   },
 *   error?: string - Error message if status is 'error'
 * }
 * 
 * @example
 * // Request
 * POST /api/core/generate_prompt
 * Authorization: Bearer <token>
 * {
 *   "taskDescription": "Create a translation prompt for English to French",
 *   "initialPrompt": "Translate to French"
 * }
 * 
 * // Success Response
 * {
 *   "status": "success",
 *   "type": "prompt_optimization", 
 *   "data": {
 *     "optimizedPrompt": "Please translate the following English text into French, maintaining the original tone and context while ensuring natural and fluent translation."
 *   }
 * }
 * 
 * // Error Response
 * {
 *   "status": "error",
 *   "error": "Missing required fields"
 * }
 */

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