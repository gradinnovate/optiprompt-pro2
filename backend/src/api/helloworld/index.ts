import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/authreq';

export default function handler(req: AuthenticatedRequest, res: Response): void {
  try {
    res.status(200).json({
      message: 'Hello World!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      user: req.user
    });
  } catch (error: any) {
    console.error('Hello world error:', error.message || error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Unknown error occurred'
    });
  }
} 