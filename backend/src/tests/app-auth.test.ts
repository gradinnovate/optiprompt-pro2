import { OAuth2Client } from 'google-auth-library';
import axios, { AxiosInstance } from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { firebaseConfig } from '../lib/firebase/client';
import http from 'http';
import type { AuthCallbackResponse } from '../../pages/api/auth/callback';

// 確保載入環境變量
config();

const execAsync = promisify(exec);

// 初始化 Firebase client
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

// API 基礎 URL
const API_BASE_URL = 'http://localhost:3000';
const AUTH_CALLBACK_URL = `${API_BASE_URL}/api/auth/callback`;

describe('App OAuth Flow', () => {
  const TEST_PORT = 5001;
  const TEST_SERVER = `http://localhost:${TEST_PORT}`;
  const REDIRECT_URI = `${TEST_SERVER}/getauthcode`;
  
  let axiosInstance: AxiosInstance;
  let appOAuthClient: OAuth2Client;
  let server: http.Server;
  let authCodeResolve: ((code: string) => void) | null = null;
  
  beforeAll(async () => {
    console.log('\nSetting up test environment...');
    
    // 1. 設置 axios 實例
    axiosInstance = axios.create({
      timeout: 5000,
      validateStatus: () => true,
      httpAgent: new http.Agent({ keepAlive: false })
    });

    // 2. 設置 OAuth client
    if (!process.env.GOOGLE_APP_CLIENT_ID) {
      throw new Error('Missing Google App client ID');
    }

    appOAuthClient = new OAuth2Client({
      clientId: process.env.GOOGLE_APP_CLIENT_ID,
      redirectUri: REDIRECT_URI
    });

    // 3. 創建並啟動測試服務器
    console.log('Starting test server...');
    server = http.createServer((req, res) => {
      if (req.url?.startsWith('/getauthcode')) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const code = url.searchParams.get('code');

        if (code && authCodeResolve) {
          authCodeResolve(code);
          authCodeResolve = null;

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<html><body><h1>Authorization Successful</h1></body></html>');
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('No authorization code received');
        }
      }
    });

    await new Promise<void>(resolve => {
      server.listen(TEST_PORT, () => {
        console.log(`Test server running at ${TEST_SERVER}`);
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
    axiosInstance.defaults.httpAgent?.destroy();
  });

  it('should complete OAuth flow and access helloworld API', async () => {
    // 1. 生成授權 URL
    const authUrl = appOAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      redirect_uri: REDIRECT_URI
    });

    // 2. 等待授權碼
    const authCodePromise = new Promise<string>(resolve => {
      authCodeResolve = resolve;
    });

    // 3. 打開瀏覽器
    if (process.platform === 'darwin') {
      await execAsync(`open "${authUrl}"`);
    } else if (process.platform === 'win32') {
      await execAsync(`start "${authUrl}"`);
    } else {
      await execAsync(`xdg-open "${authUrl}"`);
    }

    // 4. 獲取授權碼
    const code = await authCodePromise;

    // 5. 調用 auth callback API 獲取 token
    const authResponse = await axiosInstance.post<AuthCallbackResponse>(AUTH_CALLBACK_URL, {
      code,
      redirect_uri: REDIRECT_URI,
      client_id: process.env.GOOGLE_APP_CLIENT_ID
    });

    console.log('Auth Response:', authResponse.data);
    expect(authResponse.status).toBe(200);
    expect(authResponse.data.status).toBe('success');
    expect(authResponse.data.data?.customToken).toBeDefined();

    // 6. 使用 custom token 登入 Firebase
    const userCredential = await signInWithCustomToken(
      firebaseAuth,
      authResponse.data.data!.customToken
    );
    
    // 7. 獲取 ID token
    const idToken = await userCredential.user.getIdToken();

    // 8. 使用 ID token 調用 helloworld API
    const helloResponse = await axiosInstance.get(`${API_BASE_URL}/api/helloworld`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    console.log('Hello Response:', helloResponse.data);
    expect(helloResponse.status).toBe(200);
    expect(helloResponse.data.status).toBe('success');
    expect(helloResponse.data.data?.message).toBe('Hello, World!');
    expect(helloResponse.data.data?.timestamp).toBeDefined();
    expect(helloResponse.data.data?.userEmail).toBeDefined();
    expect(helloResponse.data.data?.userEmail).toBe(authResponse.data.data?.user.email);
  }, 180000);
}); 