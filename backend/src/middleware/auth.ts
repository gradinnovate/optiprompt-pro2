import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '../lib/firebase/admin';

interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void | Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    auth.verifyIdToken(token)
      .then(decodedToken => {
        req.user = decodedToken;
        next();
      })
      .catch(error => {
        console.error('Token verification failed:', error);
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token'
        });
      });
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
} 