import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Command } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  category?: string;
}

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['H'], description: 'Go to Home', category: 'Navigation' },
  { keys: ['D'], description: 'Go to Dashboard', category: 'Navigation' },
  { keys: ['P'], description: 'Go to Profile', category: 'Navigation' },
  { keys: ['T'], description: 'Go to Tasks', category: 'Navigation' },
  { keys: ['W'], description: 'Go to Wallet', category: 'Navigation' },
  { keys: ['L'], description: 'Go to Leaderboard', category: 'Navigation' },
  
  // Actions
  { keys: ['⌘', 'K'], description: 'Open search', category: 'Actions' },
  { keys: ['⌘', ','], description: 'Open settings', category: 'Actions' },
  { keys: ['⌘', '⇧', 'T'], description: 'Toggle theme', category: 'Actions' },
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Actions' },
  
  // General
  { keys: ['Esc'], description: 'Close modal / Cancel', category: 'General' },
  { keys: ['Enter'], description: 'Confirm / Submit', category: 'General' },
  { keys: ['Tab'], description: 'Navigate to next element', category: 'General' },
  { keys: ['⇧', 'Tab'], description: 'Navigate to previous element', category: 'General' },
];

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
}) => {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-blue/20 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-primary-cyan dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white dark:text-white">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-sm text-gray-400 dark:text-gray-300">
                    Navigate faster with keyboard
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-3">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="text-sm text-gray-300 dark:text-gray-300">
                            {shortcut.description}
                          </span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <React.Fragment key={keyIndex}>
                                <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-white/10 dark:bg-gray-700 border border-white/10 dark:border-gray-600 rounded text-xs font-mono text-gray-300 dark:text-gray-300 shadow-sm">
                                  {key === '⌘' ? (
                                    <Command className="w-3 h-3" />
                                  ) : (
                                    key
                                  )}
                                </kbd>
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className="text-gray-400 text-xs">+</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 dark:border-gray-700 bg-white/5 dark:bg-gray-800/50">
              <p className="text-xs text-center text-gray-400 dark:text-gray-300">
                Press <kbd className="px-1.5 py-0.5 bg-white/10 dark:bg-gray-700 rounded text-xs">?</kbd> anytime to show this help
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsHelp;
