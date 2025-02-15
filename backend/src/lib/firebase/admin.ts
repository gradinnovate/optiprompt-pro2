import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from 'dotenv';

// 確保載入環境變量
config();

// 驗證必要的環境變量
if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('Missing FIREBASE_PROJECT_ID');
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('Missing FIREBASE_CLIENT_EMAIL');
}
if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Missing FIREBASE_PRIVATE_KEY');
}

// 初始化 Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // 處理私鑰中的換行符
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

// 導出 auth 實例
export const auth = getAuth(); 