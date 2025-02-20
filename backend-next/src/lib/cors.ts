import { NextApiRequest, NextApiResponse } from 'next';

export function corsMiddleware(req: NextApiRequest, res: NextApiResponse) {
  // 獲取請求來源
  const origin = req.headers.origin;
  //console.log('origin', origin);
  // 設置 CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // 處理 OPTIONS 請求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}