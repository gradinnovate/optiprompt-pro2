"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const query_1 = require("../../../utils/query");
const auth_1 = require("../../../lib/google/auth");
const admin_1 = require("../../../lib/firebase/admin");
async function handler(req, res) {
    try {
        // 1. 驗證請求參數
        const code = (0, query_1.getQueryValue)(req.query.code);
        const redirectUri = (0, query_1.getQueryValue)(req.query.redirect_uri);
        const clientId = (0, query_1.getQueryValue)(req.query.client_id);
        console.log('Auth callback received:', {
            code: code ? '***' + code.slice(-10) : undefined,
            redirectUri,
            clientId: clientId ? '***' + clientId.slice(-6) : undefined
        });
        // 2. 參數驗證
        if (!code) {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Authorization code is required'
            });
            return;
        }
        if (!redirectUri) {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Redirect URI is required'
            });
            return;
        }
        if (!clientId) {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Client ID is required'
            });
            return;
        }
        // 3. 驗證 client ID
        if (clientId !== process.env.GOOGLE_APP_CLIENT_ID) {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid client ID'
            });
            return;
        }
        try {
            // 4. 使用授權碼獲取 tokens
            const tokens = await (0, auth_1.getGoogleTokens)(code, redirectUri, clientId);
            if (!tokens.id_token) {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'No ID token received from Google'
                });
                return;
            }
            // 5. 驗證 ID token
            const payload = await (0, auth_1.verifyGoogleToken)(tokens.id_token, clientId);
            if (!payload || !payload.email) {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'Invalid token or missing email'
                });
                return;
            }
            // 6. 創建或獲取 Firebase 用戶
            const firebaseUser = await admin_1.auth.createUser({
                email: payload.email,
                emailVerified: payload.email_verified || false,
                displayName: payload.name || undefined,
                photoURL: payload.picture || undefined,
                disabled: false,
            }).catch((error) => {
                if (error.code === 'auth/email-already-exists') {
                    return admin_1.auth.getUserByEmail(payload.email);
                }
                throw error;
            });
            // 7. 創建自定義 token
            const customToken = await admin_1.auth.createCustomToken(firebaseUser.uid);
            // 8. 返回用戶信息和 token
            res.status(200).json({
                customToken,
                user: {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                }
            });
        }
        catch (error) {
            console.error('OAuth error details:', {
                message: error.message,
                response: error.response?.data,
                stack: error.stack
            });
            res.status(400).json({
                error: 'Invalid Authorization Code',
                message: error.message || 'The provided authorization code is invalid or expired',
                details: error.response?.data || error.toString()
            });
        }
    }
    catch (error) {
        console.error('Auth callback error:', error.message || error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'Unknown error occurred'
        });
    }
}
