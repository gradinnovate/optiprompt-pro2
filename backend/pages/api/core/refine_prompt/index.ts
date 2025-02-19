import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../../src/lib/auth/verify';
import { refinePrompt } from '../../../../src/lib/core/refine_prompt';
import { ApiResponse } from '../../../../src/types/api';
import { corsMiddleware } from '../../../../src/lib/cors';

/**
 * Refine Prompt API
 * 
 * This API endpoint refines a prompt based on critique feedback.
 * 
 * @route POST /api/core/refine_prompt
 * 
 * @authentication Required - Bearer token must be provided in Authorization header
 * 
 * @body {
 *   prompt: string - The prompt to be refined
 *   critiqueFeedback: string - Feedback from critique to guide refinement
 * }
 * 
 * @returns {
 *   status: 'success' | 'error',
 *   type?: 'refined_prompt',
 *   data?: {
 *     refinedPrompts: string[] - The refined prompts based on feedback
 *   },
 *   error?: string - Error message if status is 'error'
 * }
 * 
 * @example
 * // Request
 * POST /api/core/refine_prompt
 * Authorization: Bearer <token>
 * {
 *   "prompt": "Write a story about a dog",
 *   "critiqueFeedback": "The prompt lacks specific details about the dog's characteristics and story elements"
 * }
 * 
 * // Success Response
 * {
 *   "status": "success",
 *   "type": "refined_prompt",
 *   "data": {
 *     "refinedPrompts": [
 *       "Write an engaging story about a loyal German Shepherd who helps their elderly owner overcome daily challenges while dealing with city life",
 *       "Create a story about a dog that learns to navigate city life and helps its owner overcome challenges"
 *     ]
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

    const { prompt, critiqueFeedback } = req.body;
    if (!prompt || !critiqueFeedback) {
      return res.status(400).json({
        status: 'error',
        error: 'Missing required fields'
      });
    }

    // 3. 調用核心邏輯
    const result = await refinePrompt(prompt, critiqueFeedback);

    // 4. 返回結果
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in refine_prompt API:', error);
    return res.status(500).json({
      status: 'error',
      error: 'Internal server error'
    });
  }
} 