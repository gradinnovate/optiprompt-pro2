import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from 'dotenv';

// Load environment variables
config();

// Ensure environment variables are set
if (!process.env.FIREBASE_PROJECT_ID || 
    !process.env.FIREBASE_CLIENT_EMAIL || 
    !process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Missing Firebase Admin SDK credentials in environment variables');
}

// Initialize Firebase Admin with proper typing
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount)
});

export const auth = getAuth(app); 