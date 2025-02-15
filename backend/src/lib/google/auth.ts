import { OAuth2Client, TokenPayload, Credentials } from 'google-auth-library';
import { config } from 'dotenv';

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

export async function getGoogleTokens(
  code: string, 
  redirectUri?: string,
  clientId?: string
): Promise<Credentials> {
  try {
    console.log('Getting tokens for code:', '***' + code.slice(-10));
    console.log('Using redirect URI:', redirectUri);
    console.log('Using client ID:', clientId ? '***' + clientId.slice(-6) : 'default');
    
    // 創建對應的 OAuth client
    let client: OAuth2Client;
    if (clientId && redirectUri) {
      client = new OAuth2Client({
        clientId,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        redirectUri
      });
    } else {
      client = oauth2Client;
    }
    
    console.log('Exchanging code for tokens...');
    const { tokens } = await client.getToken({
      code,
      client_id: clientId,
      redirect_uri: redirectUri
    });

    console.log('Received tokens:', {
      hasIdToken: !!tokens.id_token,
      hasAccessToken: !!tokens.access_token
    });
    return tokens;
  } catch (error: any) {
    // 改進錯誤處理
    if (error.response?.data?.error === 'invalid_grant') {
      console.error('Invalid or expired authorization code');
      throw new Error('Authorization code is invalid or expired');
    }
    if (error.response?.data?.error === 'invalid_request') {
      console.error('Invalid request:', error.response.data.error_description);
      throw new Error('Invalid request configuration');
    }
    console.error('Error getting tokens:', error.message || error);
    throw error;
  }
}

export async function verifyGoogleToken(
  idToken: string,
  clientId?: string
): Promise<TokenPayload | undefined> {
  try {
    console.log('Verifying token...');
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: clientId || process.env.GOOGLE_APP_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('Token verified successfully');
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
} 