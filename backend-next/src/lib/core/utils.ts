export function formatGptResponse(content: string): string[] {
    // Match all content between <START> and <END> tags
    const matches = content.match(/<START>([\s\S]*?)<END>/g);
    if (!matches) return [content.trim()];
    
    // Extract the content between tags and clean it up
    return matches.map(match => 
      match
        .replace(/<START>/, '')
        .replace(/<END>/, '')
        .trim()
    );
}
  