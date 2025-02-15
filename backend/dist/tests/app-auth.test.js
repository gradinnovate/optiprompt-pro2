"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
// 確保載入環境變量
(0, dotenv_1.config)();
const execAsync = (0, util_1.promisify)(child_process_1.exec);
describe('App OAuth Flow', () => {
    const TEST_PORT = 5001;
    const TEST_SERVER = `http://localhost:${TEST_PORT}`;
    const REDIRECT_URI = `${TEST_SERVER}/getauthcode`;
    const BACKEND_URL = 'http://localhost:3000/api/auth/callback';
    let axiosInstance;
    let appOAuthClient;
    let testServer;
    let server;
    let authCodeResolve = null;
    beforeAll(async () => {
        console.log('\nSetting up test environment...');
        // 1. 設置 axios 實例
        axiosInstance = axios_1.default.create({
            timeout: 5000,
            validateStatus: () => true,
            httpAgent: new (require('http').Agent)({ keepAlive: false })
        });
        // 2. 設置 OAuth client
        if (!process.env.GOOGLE_APP_CLIENT_ID) {
            throw new Error('Missing Google App client ID');
        }
        appOAuthClient = new google_auth_library_1.OAuth2Client({
            clientId: process.env.GOOGLE_APP_CLIENT_ID,
            redirectUri: REDIRECT_URI
        });
        // 3. 創建並啟動測試服務器
        console.log('Starting test server...');
        testServer = (0, express_1.default)();
        // 設置回調處理路由
        testServer.get('/getauthcode', (req, res) => {
            console.log('\nReceived callback request:', {
                url: req.url,
                query: {
                    code: req.query.code ? '***' + req.query.code.toString().slice(-10) : undefined,
                    state: req.query.state,
                    scope: req.query.scope,
                    authuser: req.query.authuser,
                    prompt: req.query.prompt
                },
                headers: {
                    'user-agent': req.headers['user-agent'],
                    referer: req.headers.referer
                }
            });
            const { code, state } = req.query;
            if (code) {
                // 驗證 state 參數
                if (state) {
                    try {
                        const decodedState = JSON.parse(Buffer.from(state.toString(), 'base64').toString());
                        console.log('State validation:', decodedState);
                    }
                    catch (error) {
                        console.warn('Failed to decode state:', error);
                    }
                }
                console.log('Received auth code:', '***' + code.toString().slice(-10));
                // 如果有等待的 resolve 函數，調用它
                if (authCodeResolve) {
                    authCodeResolve(code.toString());
                    authCodeResolve = null;
                }
                res.send(`
          <html>
            <body>
              <h1>Authorization Successful</h1>
              <p>You can close this window now.</p>
              <script>window.close();</script>
            </body>
          </html>
        `);
            }
            else {
                console.error('No authorization code received');
                res.status(400).send('No authorization code received');
            }
        });
        // 等待服務器啟動
        server = await new Promise((resolve, reject) => {
            try {
                const s = testServer.listen(TEST_PORT, () => {
                    console.log(`Test server running at ${TEST_SERVER}`);
                    resolve(s);
                });
            }
            catch (error) {
                console.error('Failed to start test server:', error);
                reject(error);
            }
        });
        console.log('Test environment setup completed');
    });
    afterAll(async () => {
        console.log('\nCleaning up test environment...');
        if (server) {
            await new Promise(resolve => server.close(resolve));
            console.log('Test server closed');
        }
    });
    it('should complete App OAuth flow and return user info', async () => {
        console.log('\nStarting OAuth flow test...');
        // 1. 生成授權 URL
        const authUrl = appOAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
            redirect_uri: REDIRECT_URI,
            prompt: 'consent',
            state: Buffer.from(JSON.stringify({
                test: true,
                timestamp: Date.now()
            })).toString('base64')
        });
        console.log('\nGenerated Auth URL:', authUrl);
        // 2. 創建 Promise 來等待授權碼
        const authCodePromise = new Promise((resolve) => {
            authCodeResolve = resolve; // 保存 resolve 函數
        });
        // 3. 打開瀏覽器
        console.log('\nOpening browser...');
        try {
            if (process.platform === 'darwin') {
                await execAsync(`open "${authUrl}"`);
            }
            else if (process.platform === 'win32') {
                await execAsync(`start "${authUrl}"`);
            }
            else {
                await execAsync(`xdg-open "${authUrl}"`);
            }
            console.log('Browser launched successfully');
        }
        catch (error) {
            console.error('Failed to open browser:', error);
            throw error;
        }
        // 4. 等待授權碼
        console.log('\nWaiting for authorization code...');
        const code = await authCodePromise;
        console.log('Received authorization code');
        // 4. 調用後端 API
        console.log('\nCalling backend API with:', {
            code: '***' + code.slice(-10),
            redirect_uri: REDIRECT_URI,
            client_id: '***' + process.env.GOOGLE_APP_CLIENT_ID.slice(-6),
            client_type: 'app'
        });
        const response = await axiosInstance.get(BACKEND_URL, {
            params: {
                code,
                redirect_uri: REDIRECT_URI,
                client_id: process.env.GOOGLE_APP_CLIENT_ID,
                client_type: 'app'
            }
        }).catch(error => {
            console.error('Backend API error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        });
        console.log('Backend API response:', {
            status: response.status,
            error: response.data.error,
            message: response.data.message
        });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('user');
        expect(response.data.user).toHaveProperty('email');
        expect(response.data.user).toHaveProperty('uid');
        expect(response.data).toHaveProperty('customToken');
        console.log('\nUser info received:', {
            uid: response.data.user.uid,
            email: response.data.user.email,
            displayName: response.data.user.displayName
        });
    }, 180000);
    it('should handle invalid authorization code', async () => {
        const mockCode = 'invalid_auth_code';
        const response = await axiosInstance.get(BACKEND_URL, {
            params: {
                code: mockCode,
                redirect_uri: REDIRECT_URI,
                client_id: process.env.GOOGLE_APP_CLIENT_ID,
                client_type: 'app'
            }
        });
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error');
        expect(response.data.error).toBe('Invalid Authorization Code');
    });
    it('should handle missing authorization code', async () => {
        const response = await axiosInstance.get(BACKEND_URL);
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error');
        expect(response.data.message).toBe('Authorization code is required');
    });
});
