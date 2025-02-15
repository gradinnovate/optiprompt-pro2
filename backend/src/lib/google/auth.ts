import { OAuth2Client, TokenPayload, Credentials } from 'google-auth-library';
import { config } from 'dotenv';

// 確保在最開始就載入環境變量
config();

// 改回 Firebase Auth handler
const REDIRECT_URI = 'https://optiprompt-pro.firebaseapp.com/__/auth/handler';

// 改用函數來創建和檢查 OAuth client
function createOAuthClient() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Missing Google OAuth credentials in environment variables');
    console.error('GOOGLE_CLIENT_ID:', !!process.env.GOOGLE_CLIENT_ID);
    console.error('GOOGLE_CLIENT_SECRET:', !!process.env.GOOGLE_CLIENT_SECRET);
    throw new Error('Missing required Google OAuth credentials');
  }

  return new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: REDIRECT_URI
  });
}

export const oauth2Client = createOAuthClient();

export async function getGoogleTokens(code: string): Promise<Credentials> {
  try {
    console.log('Getting tokens for code:', '***' + code.slice(-10));
    
    console.log('Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Received tokens:', {
      hasIdToken: !!tokens.id_token,
      hasAccessToken: !!tokens.access_token,
      tokenLength: tokens.id_token?.length
    });
    return tokens;
  } catch (error: any) {
    // 改進錯誤處理
    if (error.response?.data?.error === 'invalid_grant') {
      console.error('Invalid or expired authorization code');
      throw new Error('Authorization code is invalid or expired');
    }
    console.error('Error getting tokens:', error.message || error);
    throw error;
  }
}

export async function verifyGoogleToken(idToken: string): Promise<TokenPayload | undefined> {
  try {
    console.log('Verifying token...');
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('Token verified successfully');
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
} 