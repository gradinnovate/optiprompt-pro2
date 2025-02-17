import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleTokens, verifyGoogleToken } from '../../../../src/lib/google/auth';
import { auth } from '../../../../src/lib/firebase/admin';
import { ApiResponse } from '../../../../src/types/api';

export type AuthCallbackResponse = ApiResponse & {
  data?: {
    customToken: string;
    user: {
      uid: string;
      email: string | undefined;
      displayName: string | undefined;
      photoURL: string | undefined;
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthCallbackResponse>
) {
  try {
    // 1. 驗證請求方法
    if (req.method !== 'POST') {
      return res.status(405).json({
        status: 'error',
        error: 'Method not allowed'
      });
    }

    // 2. 驗證請求參數
    const { code, redirect_uri: redirectUri, client_id: clientId } = req.body;
    
    console.log('Auth callback received:', {
      code: code ? '***' + code.slice(-10) : undefined,
      redirectUri,
      clientId: clientId ? '***' + clientId.slice(-6) : undefined
    });

    // 3. 參數驗證
    if (!code || !redirectUri || !clientId) {
      return res.status(400).json({
        status: 'error',
        error: 'Missing required parameters'
      });
    }

    // 4. 驗證 client ID
    if (clientId !== process.env.GOOGLE_APP_CLIENT_ID) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid client ID'
      });
    }

    try {
      // 5. 使用授權碼獲取 tokens
      const tokens = await getGoogleTokens(code, redirectUri, clientId);
      
      if (!tokens.id_token) {
        return res.status(400).json({
          status: 'error',
          error: 'No ID token received from Google'
        });
      }

      // 6. 驗證 ID token
      const payload = await verifyGoogleToken(tokens.id_token, clientId);
      
      if (!payload || !payload.email) {
        return res.status(400).json({
          status: 'error',
          error: 'Invalid token or missing email'
        });
      }

      // 7. 創建或獲取 Firebase 用戶
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

      // 8. 創建自定義 token
      const customToken = await auth.createCustomToken(firebaseUser.uid);

      // 9. 返回用戶信息和 token
      return res.status(200).json({
        status: 'success',
        data: {
          customToken,
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }
        }
      });

    } catch (error: any) {
      console.error('OAuth error details:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });

      return res.status(400).json({
        status: 'error',
        error: error.message || 'The provided authorization code is invalid or expired'
      });
    }

  } catch (error: any) {
    console.error('Auth callback error:', error.message || error);
    return res.status(500).json({
      status: 'error',
      error: 'Internal server error'
    });
  }
} 