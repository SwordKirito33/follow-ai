import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Star, History } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchSuggestion {
  type: 'recent' | 'popular' | 'tool';
  text: string;
  icon?: React.ReactNode;
}

interface AdvancedTaskSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const AdvancedTaskSearch: React.FC<AdvancedTaskSearchProps> = ({
  onSearch,
  placeholder = 'Search tasks, tools, or categories...',
  className = '',
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('follow-ai-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search to recent
  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    
    setRecentSearches(updated);
    localStorage.setItem('follow-ai-recent-searches', JSON.stringify(updated));
  };

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveSearch(query);
      onSearch(query);
      setIsFocused(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    saveSearch(text);
    onSearch(text);
    setIsFocused(false);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('follow-ai-recent-searches');
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const popularSearches = [
    'ChatGPT tasks',
    'High XP rewards',
    'Beginner friendly',
    'Writing tasks',
    'Code review',
  ];

  const toolSuggestions = [
    { name: 'ChatGPT', icon: '🤖' },
    { name: 'Claude', icon: '🧠' },
    { name: 'Midjourney', icon: '🎨' },
    { name: 'GitHub Copilot', icon: '💻' },
    { name: 'Notion AI', icon: '📝' },
  ];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center transition-all duration-200 ${
            isFocused
              ? 'ring-4 ring-blue-500/20 rounded-2xl'
              : ''
          }`}
        >
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-24 py-4 bg-gray-900/90 backdrop-blur-sm border-2 border-white/10 dark:border-gray-700 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
          />
          
          {/* Keyboard shortcut hint */}
          <div className="absolute right-4 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 hover:bg-gray-800/10 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-800/10 dark:bg-gray-800 rounded-lg text-xs text-gray-400">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </div>
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-gray-900/90 backdrop-blur-sm border border-white/10 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="p-4 border-b border-white/10 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-300 dark:text-gray-300 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Recent Searches
                  </h4>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="px-3 py-1.5 bg-gray-800/10 dark:bg-gray-800 hover:bg-gray-800/10 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular searches */}
            <div className="p-4 border-b border-white/10 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-300 dark:text-gray-300 flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" />
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-primary-cyan dark:text-blue-400 hover:bg-primary-blue/20 dark:hover:bg-blue-900/30 rounded-lg text-sm transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Tool suggestions */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-300 dark:text-gray-300 flex items-center gap-2 mb-3">
                <Star className="w-4 h-4" />
                Browse by Tool
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {toolSuggestions.map((tool, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(tool.name)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800/5 dark:bg-gray-800 hover:bg-gray-800/10 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <span>{tool.icon}</span>
                    <span className="truncate">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedTaskSearch;
