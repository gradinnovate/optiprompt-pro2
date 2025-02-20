import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../../src/lib/auth/verify';
import { ApiResponse } from '../../../../src/types/api';
import { corsMiddleware } from '../../../../src/lib/cors';
import { getBalance, deductBalance } from '../../../../src/lib/account';
/**
 * Deduct API
 * 
 * This API endpoint deducts credits from the user's balance.
 * 
 * @route GET /api/account/deduct
 * 
 * @authentication Required - Bearer token must be provided in Authorization header
 * 
 * 
 * @returns {
 *   status: 'success' | 'error',
 *   type: 'deduction',
 *   data?: {
 *     balance: number - The remaining balance
 *   },
 *   error?: string - Error message if status is 'error'
 * }
 * 
 * @example
 * // Request
 * GET /api/account/deduct
 * Authorization: Bearer <token>
 * 
 * 
 * // Success Response
 * {
 *   "status": "success",
 *   "type": "deduction",
 *   "data": {
 *     "balance": 100
 *   }
 * }
 * 
 * // Error Response
 * {
 *   "status": "error", 
 *   "error": "Insufficient balance"
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
    const { uid } = await verifyToken(token);
    const balance = await getBalance(uid);
    if (balance <= 0) {
      return res.status(200).json({
        status: 'error',
        type: 'deduction',
        data: {
          balance: balance
        },
        error: 'Insufficient balance'
      });
    }
    await deductBalance(uid, 1);
    // 5. 返回結果
    return res.status(200).json({
      status: 'success',
      type: 'deduction',
      data: {
        balance: balance - 1
      }
    });
  } catch (error) {
    console.error('Error in deduct API:', error);
    return res.status(500).json({ 
      status: 'error',
      error: 'Internal server error' 
    });
  }
} 