import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
}) => {
  const { t } = useLanguage();
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id
  );
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const activeTab = controlledActiveTab ?? internalActiveTab;

  // Update indicator position
  useEffect(() => {
    const activeTabElement = tabRefs.current.get(activeTab);
    if (activeTabElement && tabsRef.current) {
      const containerRect = tabsRef.current.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;

    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2.5',
  };

  const variantClasses = {
    default: {
      container: 'bg-slate-800/50/10 dark:bg-gray-800 p-1 rounded-xl',
      tab: 'rounded-lg',
      activeTab: 'bg-gray-900/90 backdrop-blur-sm shadow-sm',
      inactiveTab: 'text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white',
    },
    pills: {
      container: 'gap-2',
      tab: 'rounded-full',
      activeTab: 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white',
      inactiveTab: 'text-gray-400 dark:text-gray-400 hover:bg-slate-800/50/10 dark:hover:bg-gray-800',
    },
    underline: {
      container: 'border-b border-white/10 dark:border-gray-700',
      tab: '',
      activeTab: 'text-primary-cyan dark:text-blue-400',
      inactiveTab: 'text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white',
    },
    bordered: {
      container: 'border border-white/10 dark:border-gray-700 rounded-xl p-1',
      tab: 'rounded-lg',
      activeTab: 'bg-slate-800/50/10 dark:bg-gray-800',
      inactiveTab: 'text-gray-400 dark:text-gray-400 hover:bg-slate-800/50/5 dark:hover:bg-gray-800/50',
    },
  };

  const styles = variantClasses[variant];
  const activeTabContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab list */}
      <div
        ref={tabsRef}
        className={`relative flex ${fullWidth ? 'w-full' : 'inline-flex'} ${styles.container}`}
        role="tablist"
      >
        {/* Underline indicator */}
        {variant === 'underline' && (
          <motion.div
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-primary-cyan to-primary-blue dark:bg-blue-400"
            initial={false}
            animate={indicatorStyle}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}

        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
            }}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`
              relative flex items-center justify-center gap-2 font-medium transition-all
              ${sizeClasses[size]}
              ${styles.tab}
              ${fullWidth ? 'flex-1' : ''}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${activeTab === tab.id ? styles.activeTab : styles.inactiveTab}
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`
                  px-1.5 py-0.5 text-xs font-bold rounded-full
                  ${activeTab === tab.id
                    ? 'bg-primary-blue/20 dark:bg-blue-900/30 text-primary-cyan dark:text-blue-400'
                    : 'bg-slate-800/50/10 dark:bg-gray-700 text-gray-400 dark:text-gray-400'
                  }
                `}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {(activeTabContent || children) && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={activeTab}
          className="mt-4"
        >
          {activeTabContent || children}
        </div>
      )}
    </div>
  );
};

// Vertical tabs variant
export const VerticalTabs: React.FC<{
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}> = ({ tabs, activeTab: controlledActiveTab, onChange, className = '' }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id);
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={`flex gap-6 ${className}`}>
      {/* Tab list */}
      <div className="flex flex-col gap-1 min-w-[200px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${activeTab === tab.id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-primary-cyan dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-400 hover:bg-slate-800/50/10 dark:hover:bg-gray-800'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-slate-800/50/10 dark:bg-gray-700 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">{activeTabContent}</div>
    </div>
  );
};

export default Tabs;
