import axios from 'axios';
import { auth } from '@/lib/firebase/config';

const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? import.meta.env.VITE_CORE_API_URL_DEVELOPMENT 
  : import.meta.env.VITE_CORE_API_URL_PRODUCTION;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  status: 'success' | 'error';
  type?: string;
  data?: T;
  error?: string;
}

async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const token = await user.getIdToken();
  return token;
}

async function apiRequest<T>(endpoint: string, data: any): Promise<T> {
  const token = await getAuthToken();
  
  const response = await api.post(endpoint, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const result: ApiResponse<T> = response.data;
  
  if (result.status === 'error' || !result.data) {
    throw new Error(result.error || 'API request failed');
  }

  return result.data;
}

export interface GeneratePromptResponse {
  optimizedPrompt: string;
}

export interface CritiqueFeedbackResponse {
  critiqueFeedback: string;
}

export interface RefinedPromptsResponse {
  refinedPrompts: string[];
}

export interface GenerateVariantsResponse {
  variants: string[];
}

export const promptApi = {
  generatePrompt: (taskDescription: string, initialPrompt: string) =>
    apiRequest<GeneratePromptResponse>('/api/core/generate_prompt', {
      taskDescription,
      initialPrompt
    }),

  getCritique: (prompt: string, example: string) =>
    apiRequest<CritiqueFeedbackResponse>('/api/core/critique', {
      prompt,
      example
    }),

  refinePrompt: (prompt: string, critiqueFeedback: string) =>
    apiRequest<RefinedPromptsResponse>('/api/core/refine_prompt', {
      prompt,
      critiqueFeedback
    }),

  generateVariants: (prompt: string, taskDescription: string) =>
    apiRequest<GenerateVariantsResponse>('/api/core/generate_variants', {
      prompt,
      taskDescription
    })
}; 