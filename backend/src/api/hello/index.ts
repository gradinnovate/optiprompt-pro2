import { VercelRequest, VercelResponse } from '@vercel/node';
import { Request, Response } from 'express';

type HandlerRequest = VercelRequest | Request;
type HandlerResponse = VercelResponse | Response;

export default async function handler(
  request: HandlerRequest,
  response: HandlerResponse
) {
  try {
    const name = (request.query.name as string) || 'World';
    
    return response.status(200).json({
      message: `Hello ${name}!`,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    return response.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
} 