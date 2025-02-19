import { Ollama } from 'ollama/browser';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  top_k?: number;
  top_p?: number;
  context?: number[];
}

export class OllamaChatService {
  private static instance: OllamaChatService;
  private ollama: Ollama;
  private baseUrl: string;

  private constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.ollama = new Ollama({ host: this.baseUrl });
  }

  public static getInstance(baseUrl?: string): OllamaChatService {
    if (!OllamaChatService.instance || baseUrl) {
      OllamaChatService.instance = new OllamaChatService(baseUrl);
    }
    return OllamaChatService.instance;
  }

  public updateBaseUrl(baseUrl: string): void {
    if (this.baseUrl !== baseUrl) {
      this.baseUrl = baseUrl;
      this.ollama = new Ollama({ host: this.baseUrl });
    }
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public async chat(
    model: string,
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<string> {
    try {
      const response = await this.ollama.chat({
        model,
        messages,
        stream: false as const,
        ...options
      });

      return response.message.content;
    } catch (error) {
      console.error('Error in chat completion:', error);
      throw new Error('Failed to get chat completion');
    }
  }

  public async streamChat(
    model: string,
    messages: ChatMessage[],
    onToken: (token: string) => void,
    options: ChatOptions = {}
  ): Promise<void> {
    try {
      const stream = await this.ollama.chat({
        model,
        messages,
        stream: true as const,
        ...options
      });

      for await (const chunk of stream) {
        if (chunk.message?.content) {
          onToken(chunk.message.content);
        }
      }
    } catch (error) {
      console.error('Error in streaming chat:', error);
      throw new Error('Failed to stream chat completion');
    }
  }

  public async generateWithContext(
    model: string,
    prompt: string,
    context: string,
    options: ChatOptions = {}
  ): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: context
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return this.chat(model, messages, options);
  }

  public async streamWithContext(
    model: string,
    prompt: string,
    context: string,
    onToken: (token: string) => void,
    options: ChatOptions = {}
  ): Promise<void> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: context
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return this.streamChat(model, messages, onToken, options);
  }
}

// Export a singleton instance with default URL
export const ollamaChat = OllamaChatService.getInstance();

