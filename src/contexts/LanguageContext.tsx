import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, translations, defaultLocale, supportedLocales } from '@/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial locale from localStorage or browser, fallback to default
  const getInitialLocale = (): Locale => {
    // Check localStorage first
    const saved = localStorage.getItem('follow-ai-locale') as Locale;
    if (saved && supportedLocales.includes(saved)) {
      return saved;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    
    // Map browser language to supported locale
    const langMap: Record<string, Locale> = {
      'zh': 'zh',
      'ja': 'ja',
      'ko': 'ko',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'en': 'en',
    };
    
    if (langMap[browserLang] && supportedLocales.includes(langMap[browserLang])) {
      return langMap[browserLang];
    }
    
    return defaultLocale;
  };

  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('follow-ai-locale', newLocale);
    // Update HTML lang attribute
    document.documentElement.lang = newLocale;
  };

  // Translation function with parameter interpolation
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English if translation missing
        let fallbackValue: any = translations[defaultLocale];
        for (const fk of keys) {
          fallbackValue = fallbackValue?.[fk];
        }
        value = fallbackValue || key;
        break;
      }
    }
    
    // Handle parameter interpolation
    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() ?? match;
      });
    }
    
    return value || key;
  };

  // Set HTML lang attribute on mount and locale change
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
