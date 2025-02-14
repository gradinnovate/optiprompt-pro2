interface OllamaModelDetails {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: OllamaModelDetails;
}

export class OllamaService {
  private static STORAGE_KEY = 'ollama_base_url';

  static getBaseUrl(): string {
    return localStorage.getItem(this.STORAGE_KEY) || 'http://localhost:11434';
  }

  static setBaseUrl(url: string): void {
    localStorage.setItem(this.STORAGE_KEY, url);
  }

  static async checkConnection(baseUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  static formatSize(bytes: number): string {
    const gb = bytes / 1024 / 1024 / 1024;
    return gb.toFixed(2);
  }

  static async listModels(baseUrl: string): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${baseUrl}/api/tags`);
      if (!response.ok) throw new Error('Failed to fetch models');
      const data = await response.json();
      return data.models;
    } catch (error) {
      console.error('Failed to list models:', error);
      return [];
    }
  }
} 