export interface FirebaseError extends Error {
  code: string;
  message: string;
} 