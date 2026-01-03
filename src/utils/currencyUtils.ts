/**
 * Currency Formatting and Conversion Utilities
 */

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CNY' | 'JPY' | 'KRW' | 'BRL' | 'RUB' | 'AED';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', decimals: 2 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', decimals: 0 },
  KRW: { code: 'KRW', symbol: '₩', name: 'Korean Won', locale: 'ko-KR', decimals: 0 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', decimals: 2 },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU', decimals: 2 },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE', decimals: 2 },
};

// Approximate exchange rates (should be fetched from API in production)
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CNY: 7.24,
  JPY: 149.5,
  KRW: 1320,
  BRL: 4.97,
  RUB: 89.5,
  AED: 3.67,
};

/**
 * Format amount to currency string
 */
export const formatCurrency = (
  amount: number,
  currency: CurrencyCode = 'USD',
  options: Intl.NumberFormatOptions = {}
): string => {
  const currencyInfo = CURRENCIES[currency];
  
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currencyInfo.decimals,
    maximumFractionDigits: currencyInfo.decimals,
    ...options,
  }).format(amount);
};

/**
 * Format amount with symbol only (no currency code)
 */
export const formatWithSymbol = (
  amount: number,
  currency: CurrencyCode = 'USD'
): string => {
  const currencyInfo = CURRENCIES[currency];
  const formatted = amount.toFixed(currencyInfo.decimals);
  return `${currencyInfo.symbol}${formatted}`;
};

/**
 * Convert amount between currencies
 */
export const convertCurrency = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number => {
  // Convert to USD first, then to target currency
  const usdAmount = amount / EXCHANGE_RATES[from];
  return usdAmount * EXCHANGE_RATES[to];
};

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export const formatCompact = (
  amount: number,
  currency: CurrencyCode = 'USD'
): string => {
  const currencyInfo = CURRENCIES[currency];
  
  if (amount >= 1_000_000_000) {
    return `${currencyInfo.symbol}${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `${currencyInfo.symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${currencyInfo.symbol}${(amount / 1_000).toFixed(1)}K`;
  }
  
  return formatWithSymbol(amount, currency);
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (value: string): number => {
  // Remove currency symbols and formatting
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: CurrencyCode): string => {
  return CURRENCIES[currency]?.symbol || '$';
};

/**
 * Get currency name
 */
export const getCurrencyName = (currency: CurrencyCode): string => {
  return CURRENCIES[currency]?.name || 'US Dollar';
};

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format XP amount
 */
export const formatXP = (xp: number): string => {
  if (xp >= 1_000_000) {
    return `${(xp / 1_000_000).toFixed(1)}M XP`;
  }
  if (xp >= 1_000) {
    return `${(xp / 1_000).toFixed(1)}K XP`;
  }
  return `${xp.toLocaleString()} XP`;
};

/**
 * Calculate XP to USD value (example rate: 100 XP = $1)
 */
export const xpToUSD = (xp: number, rate: number = 100): number => {
  return xp / rate;
};

/**
 * Format XP with USD equivalent
 */
export const formatXPWithValue = (
  xp: number,
  currency: CurrencyCode = 'USD'
): string => {
  const usdValue = xpToUSD(xp);
  const convertedValue = convertCurrency(usdValue, 'USD', currency);
  return `${xp.toLocaleString()} XP ≈ ${formatCurrency(convertedValue, currency)}`;
};

export default {
  formatCurrency,
  formatWithSymbol,
  convertCurrency,
  formatCompact,
  parseCurrency,
  getCurrencySymbol,
  getCurrencyName,
  formatPercentage,
  formatXP,
  xpToUSD,
  formatXPWithValue,
  CURRENCIES,
};
