import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Briefcase, DollarSign, User, TrendingUp, Settings, FileText, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { TOOLS } from '@/data';

interface Command {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  action: () => void;
  category: 'navigation' | 'action' | 'search';
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Navigation commands
  const navigationCommands: Command[] = useMemo(() => [
    {
      id: 'home',
      label: 'Go to Home',
      icon: Home,
      action: () => {
        navigate('/');
        onClose();
        trackEvent('command_palette_navigated', { destination: 'home' });
      },
      category: 'navigation',
      keywords: ['home', 'index', 'main'],
    },
    {
      id: 'tools',
      label: 'Browse Tools',
      icon: TrendingUp,
      action: () => {
        navigate('/rankings');
        onClose();
        trackEvent('command_palette_navigated', { destination: 'tools' });
      },
      category: 'navigation',
      keywords: ['tools', 'rankings', 'browse'],
    },
    {
      id: 'hire',
      label: 'Hire Marketplace',
      icon: Briefcase,
      action: () => {
        navigate('/hire');
        onClose();
        trackEvent('command_palette_navigated', { destination: 'hire' });
      },
      category: 'navigation',
      keywords: ['hire', 'marketplace', 'jobs', 'tasks'],
    },
    {
      id: 'earn',
      label: 'Earn Money',
      icon: DollarSign,
      action: () => {
        navigate('/tasks');
        onClose();
        trackEvent('command_palette_navigated', { destination: 'earn' });
      },
      category: 'navigation',
      keywords: ['earn', 'money', 'bounties', 'tasks'],
    },
    {
      id: 'submit',
      label: 'Submit Output',
      icon: FileText,
      action: () => {
        navigate('/submit');
        onClose();
        trackEvent('command_palette_navigated', { destination: 'submit' });
      },
      category: 'navigation',
      keywords: ['submit', 'output', 'review'],
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      action: () => {
        navigate('/profile');
        onClose();
        trackEvent('command_palette_navigated', { destination: 'profile' });
      },
      category: 'navigation',
      keywords: ['profile', 'account', 'me'],
    },
  ], [navigate, onClose]);

  // Action commands
  const actionCommands: Command[] = useMemo(() => [
    {
      id: 'new-submission',
      label: 'Start New Output Submission',
      icon: Zap,
      action: () => {
        navigate('/submit');
        onClose();
        trackEvent('command_palette_used', { action: 'new_submission' });
      },
      category: 'action',
      keywords: ['new', 'submit', 'output', 'create'],
    },
    {
      id: 'post-hire-task',
      label: 'Post a Hire Task',
      icon: Briefcase,
      action: () => {
        navigate('/hire/new');
        onClose();
        trackEvent('command_palette_used', { action: 'post_hire_task' });
      },
      category: 'action',
      keywords: ['post', 'create', 'hire', 'task', 'job'],
    },
  ], [navigate, onClose]);

  // Tool search commands
  const toolCommands: Command[] = useMemo(() => {
    return TOOLS.slice(0, 10).map((tool) => ({
      id: `tool-${tool.id}`,
      label: `View ${tool.name}`,
      icon: TrendingUp,
      action: () => {
        navigate(`/tool/${tool.id}`);
        onClose();
        trackEvent('command_palette_used', { action: 'search_tool', tool: tool.name });
      },
      category: 'search',
      keywords: [tool.name.toLowerCase(), tool.category.toLowerCase(), ...(tool.useCases || [])],
    }));
  }, [navigate, onClose]);

  const allCommands = useMemo(() => [
    ...navigationCommands,
    ...actionCommands,
    ...toolCommands,
  ], [navigationCommands, actionCommands, toolCommands]);

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) {
      return allCommands;
    }

    const query = searchQuery.toLowerCase();
    return allCommands.filter((cmd) => {
      const labelMatch = cmd.label.toLowerCase().includes(query);
      const keywordMatch = cmd.keywords?.some((kw) => kw.includes(query));
      return labelMatch || keywordMatch;
    });
  }, [allCommands, searchQuery]);

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length, searchQuery]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-command-palette]')) return;
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[20vh] px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          data-command-palette
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-white/10 dark:border-gray-700 overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 dark:border-gray-700">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent border-0 outline-none text-white dark:text-white placeholder-gray-400"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-400 bg-white/10 dark:bg-gray-800 rounded border border-white/20 dark:border-gray-600">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-[400px] overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400">
                No commands found
              </div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((command, index) => {
                  const Icon = command.icon;
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={command.id}
                      onClick={command.action}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                          : 'text-white dark:text-gray-100 hover:bg-white/5 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span className="flex-1 font-medium">{command.label}</span>
                      {command.category === 'navigation' && (
                        <span className="text-xs text-gray-400">Navigation</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/10 dark:border-gray-700 bg-white/5 dark:bg-gray-800/50 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-white/20 dark:border-gray-600">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-white/20 dark:border-gray-600">↵</kbd>
                Select
              </span>
            </div>
            <span>{filteredCommands.length} result{filteredCommands.length !== 1 ? 's' : ''}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;

