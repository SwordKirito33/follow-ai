import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  ArrowRight, 
  Clock, 
  Zap, 
  FileText, 
  User, 
  Settings,
  Home,
  LayoutDashboard,
  Wallet,
  Trophy,
  Command
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchResult {
  id: string;
  type: 'page' | 'task' | 'tool' | 'user' | 'action';
  title: string;
  description?: string;
  url?: string;
  icon?: React.ReactNode;
  action?: () => void;
}

interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchCommand: React.FC<SearchCommandProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Default pages for navigation
  const defaultPages: SearchResult[] = [
    { id: 'home', type: 'page', title: 'Home', url: '/', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', type: 'page', title: 'Dashboard', url: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tasks', type: 'page', title: 'Tasks', url: '/tasks', icon: <Zap className="w-4 h-4" /> },
    { id: 'wallet', type: 'page', title: 'Wallet', url: '/wallet', icon: <Wallet className="w-4 h-4" /> },
    { id: 'leaderboard', type: 'page', title: 'Leaderboard', url: '/leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'profile', type: 'page', title: 'Profile', url: '/profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings', type: 'action', title: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('follow-ai-recent-searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults(defaultPages);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = defaultPages.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [results, selectedIndex, onClose]
  );

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    if (query.trim()) {
      const newRecent = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('follow-ai-recent-searches', JSON.stringify(newRecent));
    }

    if (result.action) {
      result.action();
    } else if (result.url) {
      navigate(result.url);
    }

    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('follow-ai-recent-searches');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, tasks, tools..."
                className="flex-1 bg-transparent text-white dark:text-white placeholder-gray-400 outline-none text-lg"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-white/10 dark:hover:bg-gray-800 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/10 dark:bg-gray-800 rounded text-xs text-gray-400">
                <Command className="w-3 h-3" />K
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-400 dark:hover:text-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-white/10 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {results.length > 0 ? (
                <div className="px-3">
                  {!query && (
                    <span className="block text-xs font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-2 px-3">
                      Quick Navigation
                    </span>
                  )}
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors ${
                        index === selectedIndex
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-primary-cyan dark:text-blue-400'
                          : 'hover:bg-white/10 dark:hover:bg-gray-800 text-gray-300 dark:text-gray-300'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${index === selectedIndex ? 'text-primary-cyan dark:text-blue-400' : 'text-gray-400'}`}>
                        {result.icon || <FileText className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{result.title}</p>
                        {result.description && (
                          <p className="text-xs text-gray-400 dark:text-gray-300 truncate">
                            {result.description}
                          </p>
                        )}
                      </div>
                      {index === selectedIndex && (
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 dark:text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 dark:text-gray-300">No results found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/10 dark:border-gray-700 bg-white/5 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-300">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 dark:bg-gray-700 rounded">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white/10 dark:bg-gray-700 rounded">↓</kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 dark:bg-gray-700 rounded">↵</kbd>
                    to select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 dark:bg-gray-700 rounded">esc</kbd>
                  to close
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchCommand;
