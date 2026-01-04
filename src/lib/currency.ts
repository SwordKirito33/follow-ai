/**
 * Currency Utilities
 * Handles multi-currency support with locale detection
 */

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

/**
 * Detect user's locale currency
 */
export function detectUserCurrency(): string {
  const locale = navigator.language || 'en-US';
  
  // Map common locales to currencies
  const localeToCurrency: Record<string, string> = {
    'en-AU': 'AUD',
    'en-CA': 'CAD',
    'en-GB': 'GBP',
    'en-US': 'USD',
    'zh-CN': 'CNY',
    'ja-JP': 'JPY',
    'ko-KR': 'KRW',
    'es-ES': 'EUR',
    'fr-FR': 'EUR',
    'de-DE': 'EUR',
  };

  // Try exact match first
  if (localeToCurrency[locale]) {
    return localeToCurrency[locale];
  }

  // Try language code match
  const lang = locale.split('-')[0];
  const langToCurrency: Record<string, string> = {
    'en': 'USD',
    'zh': 'CNY',
    'ja': 'JPY',
    'ko': 'KRW',
    'es': 'EUR',
    'fr': 'EUR',
    'de': 'EUR',
  };

  return langToCurrency[lang] || 'USD';
}

/**
 * Get currency info
 */
export function getCurrencyInfo(code: string): CurrencyInfo {
  const currencies: Record<string, CurrencyInfo> = {
    USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
    AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
    CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  };

  return currencies[code] || currencies.USD;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const info = getCurrencyInfo(currency);
  const locale = currency === 'USD' ? 'en-US' : 
                 currency === 'AUD' ? 'en-AU' :
                 currency === 'GBP' ? 'en-GB' :
                 currency === 'EUR' ? 'de-DE' :
                 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert amount from USD to another currency
 * Note: This is a simplified conversion. In production, use real-time exchange rates.
 */
export function convertFromUSD(amountUSD: number, targetCurrency: string): number {
  // Simplified exchange rates (should use real-time API in production)
  const exchangeRates: Record<string, number> = {
    USD: 1.0,
    AUD: 1.5, // Example: 1 USD = 1.5 AUD
    CAD: 1.35,
    GBP: 0.8,
    EUR: 0.92,
    CNY: 7.2,
    JPY: 150,
    KRW: 1300,
  };

  const rate = exchangeRates[targetCurrency] || 1.0;
  return amountUSD * rate;
}

/**
 * Convert amount from target currency to USD
 */
export function convertToUSD(amount: number, fromCurrency: string): number {
  const exchangeRates: Record<string, number> = {
    USD: 1.0,
    AUD: 1.5,
    CAD: 1.35,
    GBP: 0.8,
    EUR: 0.92,
    CNY: 7.2,
    JPY: 150,
    KRW: 1300,
  };

  const rate = exchangeRates[fromCurrency] || 1.0;
  return amount / rate;
}

/**
 * Format price in user's local currency (converting from USD base price)
 * @param usdPrice - The base price in USD
 * @param targetCurrency - The user's local currency
 * @param showUSD - Whether to show USD equivalent
 */
export function formatCurrencyWithUSD(
  usdPrice: number,
  targetCurrency: string = 'USD',
  showUSD: boolean = true
): string {
  // Convert USD price to local currency
  const localAmount = convertFromUSD(usdPrice, targetCurrency);
  const localFormatted = formatCurrency(localAmount, targetCurrency);
  
  if (!showUSD || targetCurrency === 'USD') {
    return localFormatted;
  }

  const usdFormatted = formatCurrency(usdPrice, 'USD');
  return `${localFormatted} ≈ ${usdFormatted}`;
}

