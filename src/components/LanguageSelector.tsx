import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supportedLocales, languageInfo, Locale } from '@/i18n';

const LanguageSelector: React.FC = () => {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate languages array from languageInfo
  const languages = supportedLocales.map(code => ({
    code,
    name: languageInfo[code].nativeName,
    flag: languageInfo[code].flag,
  }));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800 transition-colors text-gray-300 dark:text-gray-300"
        aria-label={t('language.selectLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={18} />
        <span className="hidden sm:inline text-sm font-medium">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <span className="sm:hidden text-sm font-medium">{currentLanguage.flag}</span>
        <ChevronDown 
          size={14} 
          className={`hidden sm:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-white/10 dark:border-gray-700 py-2 z-50 animate-fadeIn"
          role="listbox"
          aria-label="Select language"
        >
          <div className="px-3 py-2 border-b border-white/10 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
              {t('language.selectLanguage')}
            </p>
          </div>
          <div className="max-h-[300px] overflow-y-auto py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 dark:hover:bg-gray-800 transition-colors text-left ${
                  locale === lang.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                role="option"
                aria-selected={locale === lang.code}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <span className="text-sm font-medium text-white dark:text-gray-100">
                      {lang.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-300 ml-2">
                      {languageInfo[lang.code].name}
                    </span>
                  </div>
                </div>
                {locale === lang.code && (
                  <Check size={16} className="text-primary-cyan dark:text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
