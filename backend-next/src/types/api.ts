export type ApiResponse = {
  status: 'success' | 'error';
  type?: string;
  data?: any;
  error?: string;
}; 