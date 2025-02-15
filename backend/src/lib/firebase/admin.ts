import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';

// 確保載入環境變量
config();

// Firebase Admin SDK 初始化
function initAdmin(): App {
  // 驗證必要的環境變量
  const requiredEnvVars = {
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey: process.env.FIREBASE_PRIVATE_KEY as string
  };

  // 檢查缺失的環境變量
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required Firebase configuration: ${missingVars.join(', ')}`);
  }

  const apps = getApps();
  if (!apps.length) {
    try {
      return initializeApp({
        credential: cert({
          projectId: requiredEnvVars.projectId,
          clientEmail: requiredEnvVars.clientEmail,
          privateKey: requiredEnvVars.privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
      throw error;
    }
  }
  return apps[0];
}

// 初始化 Admin SDK
const app = initAdmin();

// 導出 Firebase Admin 服務實例
export const auth = getAuth(app);
export const adminDB = getFirestore(app); 
export const accountsRef = adminDB.collection('accounts'); 
export const promptsRef = adminDB.collection('prompts');
