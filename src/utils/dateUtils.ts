/**
 * Date Formatting and Manipulation Utilities
 */

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Format date to localized string
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {},
  locale?: string
): string => {
  const d = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return d.toLocaleDateString(locale || navigator.language, defaultOptions);
};

/**
 * Format date to short format (e.g., "Jan 15, 2024")
 */
export const formatShortDate = (date: Date | string, locale?: string): string => {
  return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' }, locale);
};

/**
 * Format date to time only (e.g., "2:30 PM")
 */
export const formatTime = (date: Date | string, locale?: string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString(locale || navigator.language, {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Format date to datetime (e.g., "Jan 15, 2024, 2:30 PM")
 */
export const formatDateTime = (date: Date | string, locale?: string): string => {
  const d = new Date(date);
  return d.toLocaleString(locale || navigator.language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Format date to ISO date string (YYYY-MM-DD)
 */
export const formatISODate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date: Date | string): boolean => {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Get start of day
 */
export const startOfDay = (date: Date | string): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 */
export const endOfDay = (date: Date | string): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Add days to date
 */
export const addDays = (date: Date | string, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Add months to date
 */
export const addMonths = (date: Date | string, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * Get difference in days between two dates
 */
export const diffInDays = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format duration in milliseconds to human readable
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default {
  formatRelativeTime,
  formatDate,
  formatShortDate,
  formatTime,
  formatDateTime,
  formatISODate,
  isToday,
  isYesterday,
  startOfDay,
  endOfDay,
  addDays,
  addMonths,
  diffInDays,
  formatDuration,
  getGreeting,
};
