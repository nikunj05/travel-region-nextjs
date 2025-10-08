/**
 * Format ISO date string to readable format
 * @param isoDateString - ISO date string from API (e.g., "2025-09-19T06:16:05.000000Z")
 * @returns Formatted date string (e.g., "Aug 15, 2025")
 */
export const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format date with read time
 * @param isoDateString - ISO date string from API
 * @param readTime - Read time in minutes
 * @param t - Translation function (optional)
 * @returns Formatted string (e.g., "Aug 15, 2025 • 5 min read")
 */
export const formatDateWithReadTime = (
  isoDateString: string, 
  readTime: number, 
  t?: (key: string) => string
): string => {
  const formattedDate = formatDate(isoDateString);
  const minReadText = t ? t('minRead') : 'min read';
  return `${formattedDate} • ${readTime} ${minReadText}`;
};
