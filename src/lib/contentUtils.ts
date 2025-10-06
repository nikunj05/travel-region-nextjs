/**
 * Truncate HTML content to specified length and add read more functionality
 * @param htmlContent - HTML content string
 * @param maxLength - Maximum character length before truncation
 * @returns Object with truncated content and whether it was truncated
 */
export const truncateContent = (htmlContent: string, maxLength: number = 200) => {
  // Remove HTML tags to get plain text for length calculation
  const textContent = htmlContent.replace(/<[^>]*>/g, '');
  
  if (textContent.length <= maxLength) {
    return {
      content: htmlContent,
      isTruncated: false,
      truncatedContent: htmlContent
    };
  }

  // Find the position where to cut the HTML content
  let truncatedHtml = '';
  let currentLength = 0;
  let inTag = false;
  
  for (let i = 0; i < htmlContent.length; i++) {
    const char = htmlContent[i];
    
    if (char === '<') {
      inTag = true;
    } else if (char === '>') {
      inTag = false;
      truncatedHtml += char;
      continue;
    }
    
    if (!inTag) {
      currentLength++;
      if (currentLength > maxLength) {
        break;
      }
    }
    
    truncatedHtml += char;
  }

  // Find the last complete word boundary
  const lastSpaceIndex = truncatedHtml.lastIndexOf(' ');
  if (lastSpaceIndex > maxLength * 0.8) { // Only if we're not too far from the limit
    truncatedHtml = truncatedHtml.substring(0, lastSpaceIndex);
  }

  // Ensure we close any open HTML tags
  const openTags = truncatedHtml.match(/<[^\/][^>]*>/g) || [];
  const closeTags = truncatedHtml.match(/<\/[^>]*>/g) || [];
  
  // Add missing closing tags
  const tagStack: string[] = [];
  openTags.forEach(tag => {
    const tagName = tag.match(/<([^>\s]+)/)?.[1];
    if (tagName && !tag.includes('/')) {
      tagStack.push(tagName);
    }
  });
  
  closeTags.forEach(tag => {
    const tagName = tag.match(/<\/([^>\s]+)/)?.[1];
    if (tagName) {
      const index = tagStack.lastIndexOf(tagName);
      if (index !== -1) {
        tagStack.splice(index, 1);
      }
    }
  });
  
  // Close remaining open tags
  tagStack.reverse().forEach(tagName => {
    truncatedHtml += `</${tagName}>`;
  });

  return {
    content: htmlContent,
    isTruncated: true,
    truncatedContent: truncatedHtml
  };
};

/**
 * Get a plain text excerpt from HTML content
 * @param htmlContent - HTML content string
 * @param maxLength - Maximum character length
 * @returns Plain text excerpt
 */
export const getPlainTextExcerpt = (htmlContent: string, maxLength: number = 200): string => {
  const textContent = htmlContent.replace(/<[^>]*>/g, '');
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  return textContent.substring(0, maxLength).trim() + '...';
};
