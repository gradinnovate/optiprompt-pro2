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

const execAsync = promisify(exec);

// 確保載入環境變量
config();

// 初始化 Firebase client
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

// API 基礎 URL
const API_BASE_URL = 'http://localhost:3000';
const AUTH_CALLBACK_URL = `${API_BASE_URL}/api/auth/callback`;

describe('Core APIs Connectivity Tests', () => {
  const TEST_PORT = 5001;
  const TEST_SERVER = `http://localhost:${TEST_PORT}`;
  const REDIRECT_URI = `${TEST_SERVER}/getauthcode`;
  
  let axiosInstance: AxiosInstance;
  let appOAuthClient: OAuth2Client;
  let server: http.Server;
  let authCodeResolve: ((code: string) => void) | null = null;
  let idToken: string;
  
  beforeAll(async () => {
    // 設置測試環境（與 app-auth.test.ts 相同）
    console.log('\nSetting up test environment...');
    
    axiosInstance = axios.create({
      timeout: 30000,
      validateStatus: () => true,
      httpAgent: new http.Agent({ keepAlive: false })
    });

    if (!process.env.GOOGLE_APP_CLIENT_ID) {
      throw new Error('Missing Google App client ID');
    }

    appOAuthClient = new OAuth2Client({
      clientId: process.env.GOOGLE_APP_CLIENT_ID,
      redirectUri: REDIRECT_URI
    });

    // 設置認證服務器
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

    // 獲取認證 token
    const authUrl = appOAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      redirect_uri: REDIRECT_URI
    });

    const authCodePromise = new Promise<string>(resolve => {
      authCodeResolve = resolve;
    });

    await execAsync(`open "${authUrl}"`);
    const code = await authCodePromise;

    const authResponse = await axiosInstance.post<AuthCallbackResponse>(AUTH_CALLBACK_URL, {
      code,
      redirect_uri: REDIRECT_URI,
      client_id: process.env.GOOGLE_APP_CLIENT_ID
    });

    console.log('Auth Response:', authResponse.data);

    const userCredential = await signInWithCustomToken(
      firebaseAuth,
      authResponse.data.data!.customToken
    );
    
    idToken = await userCredential.user.getIdToken();
  });

  afterAll(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
    axiosInstance.defaults.httpAgent?.destroy();
  });

  it('should access critique API', async () => {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/core/critique`,
      {
        prompt: 'Test prompt',
        example: 'Test example'
      },
      {
        headers: { Authorization: `Bearer ${idToken}` }
      }
    );

    console.log('Critique API Response:', response.data);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('success');
  }, 30000);

  it('should access generate_prompt API', async () => {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/core/generate_prompt`,
      {
        taskDescription: 'Test task',
        initialPrompt: 'Test initial prompt'
      },
      {
        headers: { 
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Generate Prompt API Response:', response.data);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('success');
  }, 30000);

  it('should access generate_variants API', async () => {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/core/generate_variants`,
      {
        prompt: 'Test prompt',
        taskDescription: 'Test task description'
      },
      {
        headers: { 
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Generate Variants API Response:', response.data);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('success');
  }, 30000);

  it('should access refine_prompt API', async () => {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/core/refine_prompt`,
      {
        prompt: 'Test prompt',
        critiqueFeedback: 'Test feedback'
      },
      {
        headers: { 
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Refine Prompt API Response:', response.data);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('success');
  }, 30000);
}); 