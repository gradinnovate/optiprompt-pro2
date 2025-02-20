export interface Conversation {
  model: string;
  taskDescription: string;
  initialPrompt: string;
  example?:string;
  initialOutput: string;
  optimizedPrompt: string;
  critiqueFeedback?: string;
  refinedPrompts?: string[];
  variantOutputs?: string[];
  variantPrompts?: string[];
}

export interface Prompt {
  id: string;
  uid: string;
  conversation: Conversation;
  createdAt: Date;
  updatedAt: Date;
}
