import { oauth2Client } from '../lib/google/auth';
import axios, { AxiosInstance } from 'axios';
import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';

describe('Google OAuth Flow', () => {
  const REDIRECT_URI = 'https://optiprompt-pro.firebaseapp.com/__/auth/handler';
  let browser: Browser;
  let page: Page;
  let axiosInstance: AxiosInstance;
  
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox'],
      defaultViewport: null
    });

    axiosInstance = axios.create({
      timeout: 5000,
      validateStatus: () => true,
      // 添加 httpAgent 配置
      httpAgent: new (require('http').Agent)({ keepAlive: false })
    });
  });

  afterAll(async () => {
    await browser.close();
    // 確保所有請求都完成
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  it('should complete Google OAuth flow and return user info', async () => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      redirect_uri: REDIRECT_URI,
      prompt: 'consent',
      state: Buffer.from(JSON.stringify({
        // 添加一些狀態信息來幫助 Firebase Auth 處理回調
        providerId: 'google.com',
        sessionId: Date.now().toString(),
      })).toString('base64')
    });

    console.log('\nAuth URL:', authUrl);

    page = await browser.newPage();
    
    // 設置視窗大小
    await page.setViewport({ width: 1024, height: 768 });
    
    let finalCode: string | null = null;
    
    // 監聽所有導航，包括 Firebase Auth 的中間頁面
    page.on('response', async (response) => {
      const url = response.url();
      try {
        if (url.includes('accounts.google.com') && url.includes('oauth2/v4/token')) {
          const responseBody = await response.json();
          if (responseBody && responseBody.access_token) {
            finalCode = responseBody.access_token;
            console.log('\nCaptured access token from OAuth response');
          }
        } else if (url.includes(REDIRECT_URI)) {
          const urlObj = new URL(url);
          const code = urlObj.searchParams.get('code');
          if (code) {
            finalCode = code;
            console.log('\nCaptured authorization code from redirect');
          }
        }
      } catch (error) {
        // 忽略解析錯誤
      }
    });

    try {
      // 在新頁面中打開 Google 登入
      await page.goto(authUrl);

      console.log('\nPlease complete the Google authentication:');
      console.log('1. Enter your email and click Next');
      console.log('2. Enter your password and click Next');
      console.log('3. Review permissions and click Allow');
      
      // 等待 email 輸入框
      await page.waitForSelector('input[type="email"]', { 
        visible: true,
        timeout: 10000 
      });
      console.log('\nEmail input detected...');

      // 等待用戶手動輸入
      console.log('\nPlease enter your email and click Next...');
      await page.waitForSelector('input[type="password"]', {
        visible: true,
        timeout: 60000
      });
      console.log('\nPassword input detected...');

      // 等待用戶手動輸入密碼
      console.log('\nPlease enter your password and click Next...');
      
      // 等待同意頁面或完成
      await page.waitForNavigation({
        timeout: 120000,
        waitUntil: 'networkidle0'
      });

      // 等待授權碼
      let retries = 0;
      while (!finalCode && retries < 30) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
        console.log(`Waiting for authorization code... (${retries}/30)`);
      }
      
      if (finalCode) {
        console.log('\nSuccessfully obtained authorization code');
        
        // 調用我們的後端 API
        const response = await axiosInstance.get(`http://localhost:3000/api/auth/callback?code=${finalCode}`);
        
        if (response.status !== 200) {
          console.error('Callback response:', {
            status: response.status,
            data: response.data
          });
        }
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('customToken');
        expect(response.data).toHaveProperty('user');
        expect(response.data.user).toHaveProperty('uid');
        expect(response.data.user).toHaveProperty('email');
        
        console.log('\nUser info received:', {
          uid: response.data.user.uid,
          email: response.data.user.email,
          displayName: response.data.user.displayName
        });
      } else {
        throw new Error('No authorization code received');
      }
      
    } catch (error) {
      console.error('\nAuthentication error:', error);
      throw error;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }, 180000);

  it('should handle invalid authorization code', async () => {
    const mockCode = 'invalid_auth_code';
    
    try {
      const response = await axiosInstance.get(`http://localhost:3000/api/auth/callback?code=${mockCode}`);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error');
      expect(response.data.error).toBe('Invalid Authorization Code');
    } catch (error) {
      fail('Request should not throw but return 400 status: ' + error);
    }
  });

  it('should handle missing authorization code', async () => {
    try {
      const response = await axiosInstance.get('http://localhost:3000/api/auth/callback');
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error');
      expect(response.data.message).toBe('Authorization code is required');
    } catch (error) {
      fail('Request should not throw but return 400 status: ' + error);
    }
  });
}); 