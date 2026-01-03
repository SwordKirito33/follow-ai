/**
 * Internationalization utilities for Follow.ai
 * Handles locale-aware formatting for dates, numbers, currencies, and more
 */

// Get user's preferred locale
export const getPreferredLocale = (): string => {
  // Check localStorage first
  const savedLocale = localStorage.getItem('preferred-locale');
  if (savedLocale) return savedLocale;

  // Fall back to browser locale
  return navigator.language || 'en-US';
};

// Set preferred locale
export const setPreferredLocale = (locale: string): void => {
  localStorage.setItem('preferred-locale', locale);
};

// Date formatting
export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
  locale?: string
): string => {
  const d = new Date(date);
  const loc = locale || getPreferredLocale();

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(loc, defaultOptions).format(d);
};

// Relative time formatting
export const formatRelativeTime = (
  date: Date | string | number,
  locale?: string
): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  const loc = locale || getPreferredLocale();
  const rtf = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) {
    return rtf.format(diffSec, 'second');
  } else if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, 'minute');
  } else if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, 'hour');
  } else if (Math.abs(diffDay) < 7) {
    return rtf.format(diffDay, 'day');
  } else if (Math.abs(diffWeek) < 4) {
    return rtf.format(diffWeek, 'week');
  } else if (Math.abs(diffMonth) < 12) {
    return rtf.format(diffMonth, 'month');
  } else {
    return rtf.format(diffYear, 'year');
  }
};

// Number formatting
export const formatNumber = (
  num: number,
  options: Intl.NumberFormatOptions = {},
  locale?: string
): string => {
  const loc = locale || getPreferredLocale();
  return new Intl.NumberFormat(loc, options).format(num);
};

// Compact number formatting (1K, 1M, etc.)
export const formatCompactNumber = (
  num: number,
  locale?: string
): string => {
  const loc = locale || getPreferredLocale();
  return new Intl.NumberFormat(loc, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
};

// Currency formatting
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale?: string
): string => {
  const loc = locale || getPreferredLocale();
  return new Intl.NumberFormat(loc, {
    style: 'currency',
    currency,
  }).format(amount);
};

// Percentage formatting
export const formatPercent = (
  value: number,
  decimals: number = 0,
  locale?: string
): string => {
  const loc = locale || getPreferredLocale();
  return new Intl.NumberFormat(loc, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// List formatting
export const formatList = (
  items: string[],
  type: 'conjunction' | 'disjunction' | 'unit' = 'conjunction',
  locale?: string
): string => {
  const loc = locale || getPreferredLocale();
  return new Intl.ListFormat(loc, { style: 'long', type }).format(items);
};

// Plural rules
export const getPluralForm = (
  count: number,
  locale?: string
): Intl.LDMLPluralRule => {
  const loc = locale || getPreferredLocale();
  return new Intl.PluralRules(loc).select(count);
};

// Pluralize helper
export const pluralize = (
  count: number,
  singular: string,
  plural: string,
  locale?: string
): string => {
  const form = getPluralForm(count, locale);
  return form === 'one' ? singular : plural;
};

// Display names (countries, languages, currencies)
export const getDisplayName = (
  code: string,
  type: 'language' | 'region' | 'currency' | 'script' = 'language',
  locale?: string
): string => {
  const loc = locale || getPreferredLocale();
  try {
    return new Intl.DisplayNames([loc], { type }).of(code) || code;
  } catch {
    return code;
  }
};

// Time zone formatting
export const formatTimeZone = (
  date: Date = new Date(),
  timeZone?: string,
  locale?: string
): string => {
  const loc = locale || getPreferredLocale();
  const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Intl.DateTimeFormat(loc, {
    timeZone: tz,
    timeZoneName: 'long',
  })
    .formatToParts(date)
    .find((part) => part.type === 'timeZoneName')?.value || tz;
};

// Get user's time zone
export const getUserTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Duration formatting
export const formatDuration = (
  seconds: number,
  locale?: string
): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const loc = locale || getPreferredLocale();
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}${loc.startsWith('zh') ? '小时' : 'h'}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}${loc.startsWith('zh') ? '分钟' : 'm'}`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}${loc.startsWith('zh') ? '秒' : 's'}`);
  }

  return parts.join(' ');
};

// File size formatting
export const formatFileSize = (
  bytes: number,
  locale?: string
): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  const loc = locale || getPreferredLocale();
  return `${formatNumber(size, { maximumFractionDigits: 2 }, loc)} ${units[unitIndex]}`;
};

// Ordinal formatting
export const formatOrdinal = (
  num: number,
  locale?: string
): string => {
  const loc = locale || getPreferredLocale();

  // English ordinals
  if (loc.startsWith('en')) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  // Chinese ordinals
  if (loc.startsWith('zh')) {
    return `第${num}`;
  }

  // Japanese ordinals
  if (loc.startsWith('ja')) {
    return `${num}番目`;
  }

  // Korean ordinals
  if (loc.startsWith('ko')) {
    return `${num}번째`;
  }

  // Default: just return the number
  return String(num);
};

// Supported locales
export const supportedLocales = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar-SA', name: 'العربية', flag: '🇸🇦', rtl: true },
];

// Check if locale is RTL
export const isRTL = (locale?: string): boolean => {
  const loc = locale || getPreferredLocale();
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  return rtlLocales.some((rtl) => loc.startsWith(rtl));
};

export default {
  getPreferredLocale,
  setPreferredLocale,
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  formatList,
  getPluralForm,
  pluralize,
  getDisplayName,
  formatTimeZone,
  getUserTimeZone,
  formatDuration,
  formatFileSize,
  formatOrdinal,
  supportedLocales,
  isRTL,
};
