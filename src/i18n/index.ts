import { en } from './locales/en';
import { zh } from './locales/zh';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import pt from './locales/pt';
import ru from './locales/ru';
import ar from './locales/ar';

export type Locale = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'ar';
export type Translations = typeof en;

export const translations: Record<Locale, Translations> = {
  en,
  zh,
  ja: ja as unknown as Translations,
  ko: ko as unknown as Translations,
  es: es as unknown as Translations,
  fr: fr as unknown as Translations,
  de: de as unknown as Translations,
  pt: pt as unknown as Translations,
  ru: ru as unknown as Translations,
  ar: ar as unknown as Translations,
};

export const defaultLocale: Locale = 'en';
export const supportedLocales: Locale[] = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar'];

// Language display names and flags
export const languageInfo: Record<Locale, { name: string; flag: string; nativeName: string; rtl?: boolean }> = {
  en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
  zh: { name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  ja: { name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  ko: { name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  es: { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  fr: { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  de: { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  pt: { name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
  ru: { name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  ar: { name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية', rtl: true },
};

// Helper function to get nested translation
export const getNestedTranslation = (obj: any, path: string): string => {
  return path.split('.').reduce((o, p) => o?.[p], obj) || path;
};

// Check if a locale is RTL
export const isRTL = (locale: Locale): boolean => {
  return languageInfo[locale]?.rtl === true;
};
