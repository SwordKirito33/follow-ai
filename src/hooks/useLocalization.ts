import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Format number according to locale
 * @param value - Number to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 */
export function useFormatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  const { language } = useLanguage();

  return useMemo(() => {
    return new Intl.NumberFormat(language, options).format(value);
  }, [value, language, options]);
}

/**
 * Format currency according to locale
 * @param value - Amount to format
 * @param currency - Currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 */
export function useFormatCurrency(
  value: number,
  currency: string = 'USD'
): string {
  const { language } = useLanguage();

  return useMemo(() => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency,
    }).format(value);
  }, [value, currency, language]);
}

/**
 * Format date according to locale
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function useFormatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const { language } = useLanguage();

  return useMemo(() => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat(language, options).format(dateObj);
  }, [date, language, options]);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function useFormatRelativeTime(date: Date | string | number): string {
  const { language } = useLanguage();

  return useMemo(() => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [name, secondsInInterval] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInInterval);
      if (interval >= 1) {
        const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
        return rtf.format(-interval, name as Intl.RelativeTimeFormatUnit);
      }
    }

    const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
    return rtf.format(0, 'second');
  }, [date, language]);
}

/**
 * Format list according to locale
 * @param items - Items to format
 * @param options - Intl.ListFormat options
 * @returns Formatted list string
 */
export function useFormatList(
  items: string[],
  options?: Intl.ListFormatOptions
): string {
  const { language } = useLanguage();

  return useMemo(() => {
    return new Intl.ListFormat(language, options).format(items);
  }, [items, language, options]);
}
