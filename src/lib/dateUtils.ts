/**
 * Get today's date at midnight in local timezone to avoid timezone issues
 * @returns Date object set to midnight of current day
 */
export const getTodayAtMidnight = (): Date => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

/**
 * Format a Date object for API calls in YYYY-MM-DD format
 * Uses local timezone to avoid timezone conversion issues
 * @param date - Date object to format
 * @returns Formatted date string (e.g., "2025-10-17")
 */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
