export interface Credits {
  balance: number;        // 當前餘額
  totalEarned: number;    // 總共獲得的點數
  totalSpent: number;     // 總共使用的點數
  lastUpdated: Date;      // 最後更新時間
}

export interface CreditTransaction {
  id: string;
  amount: number;         // 正數表示獲得，負數表示使用
  type: CreditTransactionType;
  description: string;
  createdAt: Date;
}

export enum CreditTransactionType {
  SIGNUP_BONUS = 'SIGNUP_BONUS',       // 註冊獎勵
  DAILY_BONUS = 'DAILY_BONUS',         // 每日登入獎勵
  USAGE = 'USAGE',                     // 使用消耗
  PURCHASE = 'PURCHASE',               // 購買充值
  REFUND = 'REFUND',                   // 退款
  ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT' // 管理員調整
}
