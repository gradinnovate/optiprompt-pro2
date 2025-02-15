import { UserRecord } from 'firebase-admin/auth';
import { Credits } from './credits';

export interface Account {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  settings?: AccountSettings;
  credits: Credits;
}

export interface AccountSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: boolean;
}

export interface AccountInfo {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface CreateAccountInput {
  accountInfo: AccountInfo;
  settings?: AccountSettings;
}
