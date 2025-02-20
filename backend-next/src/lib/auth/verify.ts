import { auth } from '../firebase/admin';
import { verifyGoogleToken } from '../google/auth';

// 共用的 token payload 類型
export type TokenPayload = {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  exp?: number;  // token 過期時間
  email_verified?: boolean;  // 添加這個字段
};

/**
 * 統一的 token 驗證函數
 * 支持 Firebase ID token 和 Google ID token
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    // 首先嘗試驗證 Firebase token
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        name: decodedToken.name,
        picture: decodedToken.picture,
        exp: decodedToken.exp
      };
    } catch (error) {
      console.log('Not a Firebase token, trying Google token...');
    }

    // 如果不是 Firebase token，嘗試驗證 Google token
    const payload = await verifyGoogleToken(token);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
} 