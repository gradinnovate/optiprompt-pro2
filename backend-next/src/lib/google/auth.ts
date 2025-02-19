import { OAuth2Client } from 'google-auth-library';
import { config } from 'dotenv';
import type { TokenPayload } from '../auth/verify';

// 確保在最開始就載入環境變量
config();

function createOAuthClient(redirectUri?: string) {
  if (!process.env.GOOGLE_APP_CLIENT_ID || !process.env.GOOGLE_APP_CLIENT_SECRET) {
    console.error('Missing Google App OAuth credentials');
    throw new Error('Missing required Google App OAuth credentials');
  }

  return new OAuth2Client({
    clientId: process.env.GOOGLE_APP_CLIENT_ID,
    clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
    redirectUri: redirectUri
  });
}

// 創建默認的 OAuth client
export const oauth2Client = createOAuthClient();

/**
 * 獲取 Google OAuth tokens
 */
export async function getGoogleTokens(
  code: string,
  redirectUri: string,
  clientId: string
) {
  const oauth2Client = new OAuth2Client({
    clientId: clientId,
    clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
    redirectUri: redirectUri,
  });

  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

/**
 * 驗證 Google ID token
 */
export async function verifyGoogleToken(
  token: string,
  clientId: string = process.env.GOOGLE_APP_CLIENT_ID as string
): Promise<TokenPayload> {
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid token payload');
  }

  return {
    email: payload.email || '',
    name: payload.name,
    picture: payload.picture,
    exp: payload.exp
  };
} 