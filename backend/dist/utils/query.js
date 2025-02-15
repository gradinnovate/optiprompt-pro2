"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryValue = getQueryValue;
exports.safeSlice = safeSlice;
exports.maskCode = maskCode;
// 輔助函數來安全地處理查詢參數
function getQueryValue(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
        return value[0];
    }
    return undefined;
}
// 輔助函數來安全地截取字符串
function safeSlice(value, start) {
    if (typeof value === 'string') {
        return value.slice(start);
    }
    return undefined;
}
// 輔助函數來安全地處理並遮蔽代碼
function maskCode(code) {
    const value = getQueryValue(code);
    return value ? '***' + safeSlice(value, -10) : undefined;
}
