import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useLanguage } from '@/contexts/LanguageContext';

interface PWAInstallPromptProps {
  className?: string;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const { t } = useLanguage();
  const {
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    installApp,
    updateApp,
  } = usePWA();
  
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show prompt after a delay if installable
  useEffect(() => {
    if (isInstallable && !dismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, dismissed]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    // Remember dismissal for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Check if previously dismissed
  useEffect(() => {
    const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setDismissed(true);
      }
    }
  }, []);

  return (
    <>
      {/* Offline indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2"
          >
            <WifiOff className="w-4 h-4" />
            You're offline. Some features may be limited.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update available banner */}
      <AnimatePresence>
        {isUpdateAvailable && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-cyan to-primary-blue text-white py-3 px-4 flex items-center justify-center gap-4"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">A new version is available!</span>
            <button
              onClick={updateApp}
              className="px-4 py-1.5 bg-slate-800/50 text-primary-cyan rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Update Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install prompt */}
      <AnimatePresence>
        {showPrompt && !isInstalled && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${className}`}
          >
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-blue to-primary-purple p-4 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800/50/20 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">Install Follow-ai</h3>
                      <p className="text-sm text-blue-100">Get the best experience</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-slate-800/50/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-400">
                    <span className="w-5 h-5 bg-accent-green/20 dark:bg-green-900/30 rounded-full flex items-center justify-center text-accent-green text-xs">✓</span>
                    Works offline
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-400">
                    <span className="w-5 h-5 bg-accent-green/20 dark:bg-green-900/30 rounded-full flex items-center justify-center text-accent-green text-xs">✓</span>
                    Faster loading
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-400">
                    <span className="w-5 h-5 bg-accent-green/20 dark:bg-green-900/30 rounded-full flex items-center justify-center text-accent-green text-xs">✓</span>
                    Push notifications
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-400">
                    <span className="w-5 h-5 bg-accent-green/20 dark:bg-green-900/30 rounded-full flex items-center justify-center text-accent-green text-xs">✓</span>
                    Home screen access
                  </li>
                </ul>

                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    className="flex-1 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Install App
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-3 text-gray-400 dark:text-gray-400 hover:bg-slate-800/50/10 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Mini install button for navbar
export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (!isInstallable || isInstalled) return null;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={installApp}
      className={`p-2 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl hover:shadow-lg transition-all ${className}`}
      title="Install App"
    >
      <Download className="w-5 h-5" />
    </motion.button>
  );
};

// Online status indicator
export const OnlineStatus: React.FC = () => {
  const { isOnline } = usePWA();

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-sm text-accent-green">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-accent-gold">Offline</span>
        </>
      )}
    </div>
  );
};

export default PWAInstallPrompt;
