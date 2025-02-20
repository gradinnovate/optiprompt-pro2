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