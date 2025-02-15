import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { auth } from './lib/firebase/admin';
import authCallbackHandler from './api/auth/callback';
import helloworldHandler from './api/helloworld';
import { authMiddleware } from './middleware/auth';

// 載入環境變量
config();

// 檢查必要的環境變量
function checkRequiredEnvVars() {
  const required = [
    'GOOGLE_APP_CLIENT_ID',
    'GOOGLE_APP_CLIENT_SECRET',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// 驗證環境變量
checkRequiredEnvVars();

const app = express();
const port = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());

// 請求日誌中間件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// API 路由
app.get('/api/helloworld', authMiddleware, helloworldHandler);
app.get('/api/auth/callback', authCallbackHandler);

// 啟動服務器
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Google OAuth configured:', !!process.env.GOOGLE_APP_CLIENT_ID);
});

// 優雅關閉
process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app; 