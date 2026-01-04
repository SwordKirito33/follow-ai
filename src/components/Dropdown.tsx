import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (id: string) => void;
  selectedId?: string;
  align?: 'left' | 'right';
  width?: 'auto' | 'trigger' | number;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  selectedId,
  align = 'left',
  width = 'auto',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled || item.divider) return;
    onSelect(item.id);
    setIsOpen(false);
  };

  const getWidth = () => {
    if (width === 'auto') return 'min-w-[200px]';
    if (width === 'trigger' && triggerRef.current) {
      return `w-[${triggerRef.current.offsetWidth}px]`;
    }
    if (typeof width === 'number') return `w-[${width}px]`;
    return 'min-w-[200px]';
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 mt-2 ${getWidth()}
              bg-gray-900/90 backdrop-blur-sm
              border border-white/10 dark:border-gray-700
              rounded-xl shadow-xl overflow-hidden
              ${align === 'right' ? 'right-0' : 'left-0'}
            `}
          >
            <div className="py-1">
              {items.map((item, index) => {
                if (item.divider) {
                  return (
                    <div
                      key={`divider-${index}`}
                      className="my-1 border-t border-white/10 dark:border-gray-700"
                    />
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    disabled={item.disabled}
                    className={`
                      w-full px-4 py-2.5 flex items-center gap-3 text-left
                      transition-colors
                      ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 dark:hover:bg-gray-800'}
                      ${item.danger ? 'text-red-600 dark:text-red-400' : 'text-gray-300 dark:text-gray-300'}
                      ${selectedId === item.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    `}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-300 truncate">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {selectedId === item.id && (
                      <Check className="w-4 h-4 text-primary-cyan flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple dropdown button variant
export const DropdownButton: React.FC<{
  label: string;
  items: DropdownItem[];
  onSelect: (id: string) => void;
  selectedId?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  label,
  items,
  onSelect,
  selectedId,
  icon,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-gray-900/90 backdrop-blur-sm border border-white/20 dark:border-gray-700 hover:bg-white/5 dark:hover:bg-gray-800',
    outline: 'border-2 border-white/20 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
    ghost: 'hover:bg-white/10 dark:hover:bg-gray-800',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5 text-lg',
  };

  return (
    <Dropdown
      items={items}
      onSelect={onSelect}
      selectedId={selectedId}
      className={className}
      trigger={
        <button
          className={`
            flex items-center gap-2 rounded-lg font-medium transition-colors
            text-gray-300 dark:text-gray-300
            ${variantClasses[variant]}
            ${sizeClasses[size]}
          `}
        >
          {icon}
          <span>{label}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      }
    />
  );
};

export default Dropdown;
