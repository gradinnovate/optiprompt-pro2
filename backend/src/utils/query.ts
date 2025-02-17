// 輔助函數來安全地處理查詢參數
export function getQueryValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

// 輔助函數來處理多個查詢參數
export function getQueryValues(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value) {
    return [value];
  }
  return [];
}

// 輔助函數來解析數字類型的查詢參數
export function getQueryNumber(value: string | string[] | undefined): number | undefined {
  const strValue = getQueryValue(value);
  if (strValue === undefined) {
    return undefined;
  }
  const num = Number(strValue);
  return isNaN(num) ? undefined : num;
}

// 輔助函數來解析布爾類型的查詢參數
export function getQueryBoolean(value: string | string[] | undefined): boolean | undefined {
  const strValue = getQueryValue(value);
  if (strValue === undefined) {
    return undefined;
  }
  return strValue.toLowerCase() === 'true';
}

// 輔助函數來安全地截取字符串
export function safeSlice(value: string | undefined, start: number): string | undefined {
  if (typeof value === 'string') {
    return value.slice(start);
  }
  return undefined;
}

// 輔助函數來安全地處理並遮蔽代碼
export function maskCode(code: string | string[] | undefined): string | undefined {
  const value = getQueryValue(code);
  return value ? '***' + safeSlice(value, -10) : undefined;
} 