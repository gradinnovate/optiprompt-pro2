import { Account, AccountInfo, CreateAccountInput } from '../types/account';
import { Credits, CreditTransactionType } from '../types/credits';
import { accountsRef } from './firebase/admin';

const SIGNUP_BONUS = 100; // 註冊獎勵點數

// 內部函數，只在此模塊內使用
async function createAccount(input: CreateAccountInput): Promise<Account> {
  const { accountInfo, settings } = input;
  
  try {
    // 檢查帳號是否已存在
    const existingAccount = await getAccountByUid(accountInfo.uid);
    if (existingAccount) {
      throw new Error('Account already exists');
    }

    // 初始化 credits
    const now = new Date();
    const credits: Credits = {
      balance: SIGNUP_BONUS,
      totalEarned: SIGNUP_BONUS,
      totalSpent: 0,
      lastUpdated: now
    };

    // 創建新帳號
    const account: Account = {
      ...accountInfo,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      settings: settings || {
        theme: 'system',
        language: 'en',
        notifications: true
      },
      credits
    };

    // 開始交易
    const batch = accountsRef.firestore.batch();

    // 保存帳號
    const accountDoc = accountsRef.doc(account.uid);
    batch.set(accountDoc, account);

    // 記錄註冊獎勵交易
    const transactionRef = accountDoc.collection('transactions').doc();
    batch.set(transactionRef, {
      id: transactionRef.id,
      amount: SIGNUP_BONUS,
      type: CreditTransactionType.SIGNUP_BONUS,
      description: 'Sign up bonus credits',
      createdAt: now
    });

    // 提交交易
    await batch.commit();

    console.log('Account created successfully:', {
      uid: account.uid,
      email: account.email,
      credits: account.credits
    });

    return account;
  } catch (error: any) {
    console.error('Error creating account:', error);
    throw new Error(`Failed to create account: ${error.message}`);
  }
}

// 公開的函數，用於處理用戶登入
export async function handleUserLogin(accountInfo: AccountInfo): Promise<void> {
  try {
    const account = await getAccountByUid(accountInfo.uid);
    if (!account) {
      await createAccount({
        accountInfo,
        settings: {
          theme: 'system',
          language: 'en',
          notifications: true
        }
      });
    } else {
      await updateAccountLastLogin(accountInfo.uid);
    }
  } catch (error: any) {
    console.error('Error handling user login:', error);
    throw new Error(`Failed to handle user login: ${error.message}`);
  }
}

export async function getAccountByUid(uid: string): Promise<Account | null> {
  try {
    const doc = await accountsRef.doc(uid).get();
    return doc.exists ? (doc.data() as Account) : null;
  } catch (error: any) {
    console.error('Error getting account:', error);
    throw new Error(`Failed to get account: ${error.message}`);
  }
}

async function updateAccountLastLogin(uid: string): Promise<void> {
  try {
    await accountsRef.doc(uid).update({
      lastLoginAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error: any) {
    console.error('Error updating last login:', error);
    throw new Error(`Failed to update last login: ${error.message}`);
  }
}
