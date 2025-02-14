import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './config';

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign in failed:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}; 