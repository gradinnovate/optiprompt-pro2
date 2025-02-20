const removeThinkingProcess = (text: string): string => {
    // Return original text if no thinking process tags found
    if (!text.includes('<think>') || !text.includes('</think>')) {
      return text;
    }
  
    // Use regex to match content between <think> and </think> tags, including the tags
    const thinkingProcessRegex = /<think>[\s\S]*?<\/think>/g;
    
    // Remove all instances of thinking process sections
    return text.replace(thinkingProcessRegex, '').trim();
  };

  export { removeThinkingProcess };