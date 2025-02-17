import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../firebase/config';
import axios from 'axios';
import type { AuthCallbackResponse } from './types';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: string, data?: any): Promise<any>;
        on(channel: string, func: (...args: any[]) => void): void;
        once(channel: string, func: (...args: any[]) => void): void;
      };
    };
  }
}

// 尋找可用的 port
async function findAvailablePort(start: number, end: number): Promise<number> {
  return await window.electron.ipcRenderer.invoke('find-available-port', { start, end });
}

export async function signInWithGoogle() {
  try {
    console.log('Starting Google sign in process...');
    // 1. 找到可用的 port
    const port = await findAvailablePort(11400, 12400);
    console.log('Found available port:', port);
    const redirectUri = `http://localhost:${port}/getauthcode`;

    // 2. 創建本地服務器
    await window.electron.ipcRenderer.invoke('start-auth-server', { port });
    console.log('Auth server started');
    
    // 3. 生成授權 URL 並打開瀏覽器
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${import.meta.env.VITE_GOOGLE_APP_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')}`;

    console.log('Opening auth URL:', authUrl);
    await window.electron.ipcRenderer.invoke('open-external', authUrl);
    console.log('Browser opened');

    // 4. 等待授權碼
    const code = await new Promise<string>((resolve) => {
      window.electron.ipcRenderer.once('auth-code-received', (code) => {
        resolve(code);
      });
    });
    console.log('Received auth code');

    // 5. 關閉服務器
    await window.electron.ipcRenderer.invoke('stop-auth-server');

    // 6. 調用後端 API 獲取 custom token
    const backendUrl = import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_OAUTH_REDIRECT_URI_PRODUCTION
      : import.meta.env.VITE_OAUTH_REDIRECT_URI_DEVELOPMENT;

    const authResponse = await axios.post<AuthCallbackResponse>(backendUrl, {
      code,
      redirect_uri: redirectUri,
      client_id: import.meta.env.VITE_GOOGLE_APP_CLIENT_ID
    });

    if (authResponse.data.status !== 'success' || !authResponse.data.data?.customToken) {
      throw new Error('Failed to get custom token');
    }

    // 7. 使用 custom token 登入 Firebase
    const userCredential = await signInWithCustomToken(
      auth,
      authResponse.data.data.customToken
    );
    console.log('User signed in:', userCredential.user);

    return userCredential.user;

  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
} 