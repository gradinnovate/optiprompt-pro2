"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const callback_1 = __importDefault(require("./api/auth/callback"));
const helloworld_1 = __importDefault(require("./api/helloworld"));
const auth_1 = require("./middleware/auth");
// 載入環境變量
(0, dotenv_1.config)();
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
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// 中間件
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 請求日誌中間件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});
// API 路由
app.get('/api/helloworld', auth_1.authMiddleware, helloworld_1.default);
app.get('/api/auth/callback', callback_1.default);
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
exports.default = app;
