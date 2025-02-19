import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../../src/lib/auth/verify';
import { generatePromptVariants } from '../../../../src/lib/core/generate_variants';
import { ApiResponse } from '../../../../src/types/api';
import { corsMiddleware } from '../../../../src/lib/cors';


/**
 * Generate Prompt Variants API
 * 
 * This API endpoint generates variations of a given prompt based on a task description.
 * 
 * @route POST /api/core/generate_variants
 * 
 * @authentication Required - Bearer token must be provided in Authorization header
 * 
 * @body {
 *   prompt: string - The initial prompt to generate variants from
 *   taskDescription: string - Description of the task/context for prompt generation
 * }
 * 
 * @returns {
 *   status: 'success' | 'error',
 *   type?: 'prompt_variants',
 *   data?: {
 *     variants: string[] - Array of generated prompt variants
 *   },
 *   error?: string - Error message if status is 'error'
 * }
 * 
 * @example
 * // Request
 * POST /api/core/generate_variants
 * Authorization: Bearer <token>
 * {
 *   "prompt": "Translate this text to French",
 *   "taskDescription": "Create a translation prompt"
 * }
 * 
 * // Success Response
 * {
 *   "status": "success", 
 *   "type": "prompt_variants",
 *   "data": {
 *     "variants": [
 *       "Please translate the following text into French while maintaining the original tone",
 *       "Convert this text to French, preserving its style and meaning",
 *       // ... more variants
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