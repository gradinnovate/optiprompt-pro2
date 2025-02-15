import { VercelRequest, VercelResponse } from '@vercel/node';
import { Request, Response } from 'express';
import { getQueryValue, maskCode } from '../../../utils/query';
import { getGoogleTokens, verifyGoogleToken } from '../../../lib/google/auth';
import { auth } from '../../../lib/firebase/admin';

type HandlerRequest = VercelRequest | Request;
type HandlerResponse = VercelResponse | Response;

export default async function handler(
  request: HandlerRequest,
  response: HandlerResponse
) {
  try {
    const code = getQueryValue(request.query.code);
    console.log('Callback handler received code:', maskCode(request.query.code));

    if (!code) {
      console.log('No code provided or invalid code type');
      return response.status(400).json({
        error: 'Bad Request',
        message: 'Authorization code is required'
      });
    }

    try {
      // 獲取 tokens
      console.log('Getting tokens...');
      const tokens = await getGoogleTokens(code);
      
      if (!tokens.id_token) {
        console.log('No ID token received from Google');
        return response.status(400).json({
          error: 'Bad Request',
          message: 'No ID token received from Google'
        });
      }

      // 使用 id_token 進行驗證
      const payload = await verifyGoogleToken(tokens.id_token);
      
      if (!payload || !payload.email) {
        return response.status(400).json({
          error: 'Bad Request',
          message: 'Invalid token or missing email'
        });
      }

      // 創建或獲取 Firebase 用戶
      const firebaseUser = await auth.createUser({
        email: payload.email,
        emailVerified: payload.email_verified || false,
        displayName: payload.name || undefined,
        photoURL: payload.picture || undefined,
        disabled: false,
      }).catch((error: any) => {
        if (error.code === 'auth/email-already-exists') {
          return auth.getUserByEmail(payload.email!);
        }
        throw error;
      });

      // 創建自定義 token
      const customToken = await auth.createCustomToken(firebaseUser.uid);

      return response.status(200).json({
        customToken,
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        }
      });

    } catch (error: any) {
      console.error('OAuth error:', error.message || error);
      return response.status(400).json({
        error: 'Invalid Authorization Code',
        message: error.message || 'The provided authorization code is invalid or expired',
        details: error.response?.data?.error_description || error.toString()
      });
    }

  } catch (error: any) {
    console.error('Auth callback error:', error.message || error);
    return response.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Unknown error occurred'
    });
  }
} 