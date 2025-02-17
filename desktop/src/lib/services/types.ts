export interface AuthCallbackResponse {
  status: 'success' | 'error';
  data?: {
    customToken: string;
    user: {
      uid: string;
      email: string;
      displayName: string;
      photoURL: string;
    };
  };
  error?: string;
} 