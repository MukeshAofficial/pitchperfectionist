
/**
 * This file contains utility functions for parsing PowerPoint files.
 * Note: Full PowerPoint parsing in the browser is limited. For production use,
 * you should consider a server-side solution or a specialized service.
 */

/**
 * Attempts to extract basic metadata from a PowerPoint file
 * @param file The PowerPoint file
 */
export const extractPptMetadata = async (file: File): Promise<{
  title: string;
  slideCount: number;
  fileSize: string;
}> => {
  // In a real implementation, this would use a specialized library
  // For now, we return mock data based on the file
  
  const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
  
  return {
    title: file.name.replace(/\.[^/.]+$/, ""),
    slideCount: Math.floor(Math.random() * 10) + 5, // Mock slide count
    fileSize: `${fileSizeInMB} MB`
  };
};

/**
 * Helper function to format slide content for better display
 * @param content Raw slide content text
 */
export const formatSlideContent = (content: string): string => {
  // Replace multiple newlines with a single one
  let formatted = content.replace(/\n{3,}/g, '\n\n');
  
  // Add bullet points to lists if they don't have them
  const lines = formatted.split('\n');
  const formattedLines = lines.map((line, index, array) => {
    // If this line starts with a number or letter followed by a period, and previous line was empty
    // or the line was the first one, treat it as a list item
    if (
      line.match(/^\s*[a-zA-Z0-9]+\.\s+/) && 
      (index === 0 || array[index - 1].trim() === '')
    ) {
      return line; // Already formatted as a list item
    }
    
    // If multiple lines start with similar phrases, add bullet points
    if (
      index > 0 && 
      line.trim() !== '' && 
      array[index - 1].trim() !== '' &&
      !line.startsWith('•') && 
      !line.startsWith('-') &&
      !line.startsWith('*') &&
      line.length < 100 && // Avoid adding bullets to paragraphs
      array[index - 1].length < 100
    ) {
      // Check if this line starts similarly to the previous non-empty line
      const prevLine = array.slice(0, index).reverse().find(l => l.trim() !== '');
      if (prevLine && !prevLine.startsWith('•') && !prevLine.startsWith('Title:')) {
        return `• ${line}`;
      }
    }
    
    return line;
  });
  
  return formattedLines.join('\n');
};

/**
 * Future enhancement: Add actual PowerPoint parsing
 * This would require either:
 * 1. A server-side solution using libraries like python-pptx
 * 2. A specialized client-side library (limited options)
 * 3. Integration with a third-party service API
 */
