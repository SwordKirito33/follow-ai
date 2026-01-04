import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const COOKIE_CONSENT_KEY = 'follow-ai-cookie-consent';
const COOKIE_PREFERENCES_KEY = 'follow-ai-cookie-preferences';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsented) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);
    
    // Trigger analytics initialization if accepted
    if (prefs.analytics) {
      // Initialize analytics
      console.log('Analytics enabled');
    }
  };

  const cookieTypes = [
    {
      key: 'necessary' as const,
      label: 'Necessary',
      description: 'Essential for the website to function properly. Cannot be disabled.',
      required: true,
    },
    {
      key: 'analytics' as const,
      label: 'Analytics',
      description: 'Help us understand how visitors interact with our website.',
      required: false,
    },
    {
      key: 'marketing' as const,
      label: 'Marketing',
      description: 'Used to track visitors across websites for advertising purposes.',
      required: false,
    },
    {
      key: 'personalization' as const,
      label: 'Personalization',
      description: 'Allow us to remember your preferences and customize your experience.',
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
        >
          <div className="max-w-4xl mx-auto bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 dark:border-gray-700 overflow-hidden">
            {!showSettings ? (
              // Main banner
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-blue/20 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-6 h-6 text-primary-cyan dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white dark:text-white mb-2">
                      We value your privacy
                    </h3>
                    <p className="text-gray-400 dark:text-gray-400 text-sm mb-4">
                      We use cookies to enhance your browsing experience, serve personalized content, 
                      and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleAcceptAll}
                        className="px-6 py-2.5 bg-gradient-to-r from-primary-cyan to-primary-blue text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Accept All
                      </button>
                      <button
                        onClick={handleRejectAll}
                        className="px-6 py-2.5 bg-white/10 dark:bg-gray-800 text-gray-300 dark:text-gray-300 font-semibold rounded-xl hover:bg-white/10 dark:hover:bg-gray-700 transition-colors"
                      >
                        Reject All
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="flex items-center gap-2 px-4 py-2.5 text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Settings panel
              <div>
                <div className="p-6 border-b border-white/10 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white dark:text-white">
                      Cookie Preferences
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-2 text-gray-400 hover:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
                  {cookieTypes.map((type) => (
                    <div
                      key={type.key}
                      className="flex items-start justify-between gap-4 p-4 bg-white/5 dark:bg-gray-800 rounded-xl"
                    >
                      <div>
                        <p className="font-semibold text-white dark:text-white">
                          {type.label}
                          {type.required && (
                            <span className="ml-2 text-xs text-gray-400">(Required)</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                          {type.description}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (!type.required) {
                            setPreferences((prev) => ({
                              ...prev,
                              [type.key]: !prev[type.key],
                            }));
                          }
                        }}
                        disabled={type.required}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          preferences[type.key]
                            ? 'bg-gradient-to-r from-primary-cyan to-primary-blue'
                            : 'bg-gray-300 dark:bg-gray-600'
                        } ${type.required ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            preferences[type.key] ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-white/10 dark:border-gray-700 flex justify-end gap-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-2.5 text-gray-400 dark:text-gray-400 font-semibold hover:text-white dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-cyan to-primary-blue text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
