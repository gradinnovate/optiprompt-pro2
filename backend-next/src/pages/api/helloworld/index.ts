import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth/verify';
import { ApiResponse } from '@/types/api';
import { corsMiddleware } from '@/lib/cors';

type HelloWorldResponse = ApiResponse & {
  data?: {
    message: string;
    timestamp: number;
    userEmail?: string;
    tokenExpireTime?: number;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HelloWorldResponse>
) {
  if (corsMiddleware(req, res)) {
    return;
  }

  try {
    // 1. 驗證請求方法
    if (req.method !== 'GET') {
      return res.status(405).json({
        status: 'error',
        error: 'Method not allowed'
      });
    }

    // 2. 驗證 token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        error: 'No authorization header'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const payload = await verifyToken(token);

      // 3. 返回成功響應
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Hello, World!',
          timestamp: Date.now(),
          userEmail: payload.email,
          tokenExpireTime: payload.exp
        }
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({
        status: 'error',
        error: 'Invalid token'
      });
    }

  } catch (error) {
    console.error('Error in helloworld API:', error);
    return res.status(500).json({
      status: 'error',
      error: 'Internal server error'
    });
  }
} 