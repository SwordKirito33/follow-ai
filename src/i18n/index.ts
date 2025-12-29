import { en } from './locales/en';
import { zh } from './locales/zh';

export type Locale = 'en' | 'zh';
export type Translations = typeof en;

export const translations: Record<Locale, Translations> = {
  en,
  zh,
};

export const defaultLocale: Locale = 'en';
export const supportedLocales: Locale[] = ['en', 'zh'];

// Helper function to get nested translation
export const getNestedTranslation = (obj: any, path: string): string => {
  return path.split('.').reduce((o, p) => o?.[p], obj) || path;
};

