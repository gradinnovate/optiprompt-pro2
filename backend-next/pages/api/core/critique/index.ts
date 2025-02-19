import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../../src/lib/auth/verify';
import { critiqueGenerate } from '../../../../src/lib/core/critique';
import { ApiResponse } from '../../../../src/types/api';
import { corsMiddleware } from '../../../../src/lib/cors';

/**
 * Critique Generation API
 * 
 * This API endpoint generates a critique for a given prompt by comparing it with an example.
 * 
 * @route POST /api/core/critique
 * 
 * @authentication Required - Bearer token must be provided in Authorization header
 * 
 * @body {
 *   prompt: string - The prompt to be critiqued
 *   example: string - An example prompt to compare against
 * }
 * 
 * @returns {
 *   status: 'success' | 'error',
 *   type: 'critique_feedback',
 *   data?: {
 *     critiqueFeedback: string - The generated critique feedback
 *   },
 *   error?: string - Error message if status is 'error'
 * }
 * 
 * @example
 * // Request
 * POST /api/core/critique
 * Authorization: Bearer <token>
 * {
 *   "prompt": "Write a story about a dog",
 *   "example": "Create an engaging story about a loyal dog who helps their owner overcome challenges"
 * }
 * 
 * // Success Response
 * {
 *   "status": "success",
 *   "type": "critique_feedback",
 *   "data": {
 *     "critiqueFeedback": "The prompt lacks specific details and emotional elements" 
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
    // 1. 驗證 ID Token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        status: 'error',
        error: 'No authorization header' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    await verifyToken(token);

    // 2. 驗證請求方法
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        status: 'error',
        error: 'Method not allowed' 
      });
    }

    // 3. 解析請求體
    const { prompt, example } = req.body;
    if (!prompt || !example) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Missing required fields' 
      });
    }

    // 4. 調用核心邏輯
    const result = await critiqueGenerate(prompt, example);

    // 5. 返回結果
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in critique API:', error);
    return res.status(500).json({ 
      status: 'error',
      error: 'Internal server error' 
    });
  }
} 