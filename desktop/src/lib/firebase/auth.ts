import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { auth } from './config';

declare global {
  interface Window {
    electron: {
      openExternal: (url: string) => Promise<boolean>;
      handleAuthCallback: (callback: (token: string) => void) => void;
    };
  }
}

interface GoogleTokens {
  access_token: string;
  id_token: string;
}

async function exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      redirect_uri: `https://${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}/__/auth/handler`,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  const data = await response.json();
  return {
    access_token: data.access_token,
    id_token: data.id_token,
  };
}

export const signInWithGoogle = async () => {
  try {
    // 在開發環境使用 Firebase 的 Popup
    if (import.meta.env.DEV) {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      const result = await signInWithPopup(auth, provider);
      return result.user;
    }

    // 在生產環境使用 OAuth 2.0
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    // 使用 Firebase 提供的 OAuth 端點
    const redirectUri = encodeURIComponent(`https://${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}/__/auth/handler`);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(['profile', 'email'].join(' '))}&` +
      `state=${encodeURIComponent(JSON.stringify({
        returnUrl: 'optiprompt://auth/callback'
      }))}&` +
      `prompt=consent&` +
      `access_type=offline`;

    // 設置回調處理
    window.electron.handleAuthCallback(async (url) => {
      // 解析回調 URL
      const callbackUrl = new URL(url);
      const code = callbackUrl.searchParams.get('code');
      const state = callbackUrl.searchParams.get('state');
      
      if (code && state) {
        try {
          // 先換取 tokens
          const tokens = await exchangeCodeForTokens(code);
          
          // 使用 id_token 進行認證
          const credential = GoogleAuthProvider.credential(tokens.id_token, tokens.access_token);
          const result = await signInWithCredential(auth, credential);
          console.log('Successfully signed in:', result.user);
        } catch (error) {
          console.error('Error during authentication:', error);
        }
      }
    });

    const success = await window.electron.openExternal(authUrl);
    if (!success) {
      throw new Error('Failed to open external URL');
    }
  } catch (error) {
    console.error('Google sign in failed:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}; 