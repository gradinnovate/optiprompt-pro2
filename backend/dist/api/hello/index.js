"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
async function handler(request, response) {
    try {
        const name = request.query.name || 'World';
        return response.status(200).json({
            message: `Hello ${name}!`,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    }
    catch (error) {
        return response.status(500).json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
}
