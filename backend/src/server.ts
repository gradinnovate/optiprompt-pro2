import { config } from 'dotenv';
import { ParsedQs } from 'qs';
import { Query } from 'express-serve-static-core';

// 確保在最開始就載入環境變量
config();

import express from 'express';
import cors from 'cors';
import { maskCode } from './utils/query';
import helloHandler from './api/hello';
import authCallbackHandler from './api/auth/callback';

// 輔助函數來安全地處理查詢參數
function getQueryValue(value: Query[string]): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value[0];
  }
  return undefined;
}

// 輔助函數來安全地截取字符串
function safeSlice(value: string | undefined, start: number): string | undefined {
  if (typeof value === 'string') {
    return value.slice(start);
  }
  return undefined;
}

const app = express();
const port = process.env.PORT || 3000;

// 在啟動服務器前檢查必要的環境變量
function checkRequiredEnvVars() {
  const required = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// 檢查環境變量
checkRequiredEnvVars();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://optiprompt-pro.firebaseapp.com'],
  credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(express.json());

// Routes
app.get('/api/hello', async (req, res) => {
  await helloHandler(req, res);
});

app.get('/api/auth/callback', async (req, res) => {
  console.log('Auth callback received:', {
    code: maskCode(req.query.code),
    state: req.query.state
  });
  
  await authCallbackHandler(req, res);
});

// 添加優雅關閉
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Google OAuth configured:', !!process.env.GOOGLE_CLIENT_ID);
});

// 處理優雅關閉
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
}); 