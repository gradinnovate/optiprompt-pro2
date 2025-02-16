"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptsRef = exports.accountsRef = exports.adminDB = exports.auth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const dotenv_1 = require("dotenv");
// 確保載入環境變量
(0, dotenv_1.config)();
// Firebase Admin SDK 初始化
function initAdmin() {
    // 驗證必要的環境變量
    const requiredEnvVars = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
    };
    // 檢查缺失的環境變量
    const missingVars = Object.entries(requiredEnvVars)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
    if (missingVars.length > 0) {
        throw new Error(`Missing required Firebase configuration: ${missingVars.join(', ')}`);
    }
    const apps = (0, app_1.getApps)();
    if (!apps.length) {
        try {
            return (0, app_1.initializeApp)({
                credential: (0, app_1.cert)({
                    projectId: requiredEnvVars.projectId,
                    clientEmail: requiredEnvVars.clientEmail,
                    privateKey: requiredEnvVars.privateKey.replace(/\\n/g, '\n'),
                }),
            });
        }
        catch (error) {
            console.error('Firebase Admin initialization error:', error);
            throw error;
        }
    }
    return apps[0];
}
// 初始化 Admin SDK
const app = initAdmin();
// 導出 Firebase Admin 服務實例
exports.auth = (0, auth_1.getAuth)(app);
exports.adminDB = (0, firestore_1.getFirestore)(app);
exports.accountsRef = exports.adminDB.collection('accounts');
exports.promptsRef = exports.adminDB.collection('prompts');
