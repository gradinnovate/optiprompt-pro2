"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const dotenv_1 = require("dotenv");
// 確保載入環境變量
(0, dotenv_1.config)();
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
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)({
        credential: (0, app_1.cert)({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // 處理私鑰中的換行符
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
}
// 導出 auth 實例
exports.auth = (0, auth_1.getAuth)();
