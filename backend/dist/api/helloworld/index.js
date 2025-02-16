"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
function handler(req, res) {
    try {
        res.status(200).json({
            message: 'Hello World!',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            user: req.user
        });
    }
    catch (error) {
        console.error('Hello world error:', error.message || error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'Unknown error occurred'
        });
    }
}
