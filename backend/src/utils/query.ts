import { Query } from 'express-serve-static-core';

// 輔助函數來安全地處理查詢參數
export function getQueryValue(value: Query[string]): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value[0];
  }
  return undefined;
}

// 輔助函數來安全地截取字符串
export function safeSlice(value: string | undefined, start: number): string | undefined {
  if (typeof value === 'string') {
    return value.slice(start);
  }
  return undefined;
}

// 輔助函數來安全地處理並遮蔽代碼
export function maskCode(code: Query[string]): string | undefined {
  const value = getQueryValue(code);
  return value ? '***' + safeSlice(value, -10) : undefined;
} 