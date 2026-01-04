// Responsive Navigation Components for Follow.ai
// Mobile-first navigation with hamburger menu

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
}

interface NavProps {
  items: NavItem[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

// ============================================
// Mobile Menu Button
// ============================================

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

function MenuButton({ isOpen, onClick }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800 transition-colors"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className="w-6 h-5 relative flex flex-col justify-between">
        <span
          className={cn(
            'w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full transition-all duration-300',
            isOpen && 'rotate-45 translate-y-2'
          )}
        />
        <span
          className={cn(
            'w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full transition-all duration-300',
            isOpen && 'opacity-0'
          )}
        />
        <span
          className={cn(
            'w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full transition-all duration-300',
            isOpen && '-rotate-45 -translate-y-2'
          )}
        />
      </div>
    </button>
  );
}

// ============================================
// Nav Link Component
// ============================================

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
  mobile?: boolean;
}

function NavLink({ item, isActive, onClick, mobile }: NavLinkProps) {
  const baseClasses = mobile
    ? 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors'
    : 'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium';

  const activeClasses = isActive
    ? 'bg-blue-50 dark:bg-blue-900/30 text-primary-cyan dark:text-blue-400'
    : 'text-gray-400 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800';

  return (
    <Link href={item.href}>
      <a onClick={onClick} className={cn(baseClasses, activeClasses)}>
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span>{item.label}</span>
        {item.badge && (
          <span className="ml-auto px-2 py-0.5 text-xs bg-primary-blue/20 dark:bg-blue-900 text-primary-cyan dark:text-blue-400 rounded-full">
            {item.badge}
          </span>
        )}
      </a>
    </Link>
  );
}

// ============================================
// Mobile Menu Overlay
// ============================================

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  actions?: React.ReactNode;
}

function MobileMenu({ isOpen, onClose, items, actions }: MobileMenuProps) {
  const [location] = useLocation();

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 lg:hidden',
          'transform transition-transform duration-300 ease-out shadow-xl',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-gray-700">
            <span className="text-lg font-semibold text-white dark:text-white">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    isActive={location === item.href}
                    onClick={onClose}
                    mobile
                  />
                  {item.children && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <NavLink
                            item={child}
                            isActive={location === child.href}
                            onClick={onClose}
                            mobile
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          {actions && (
            <div className="p-4 border-t border-white/10 dark:border-gray-700">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ============================================
// Main Navigation Component
// ============================================

export function ResponsiveNav({ items, logo, actions, className }: NavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/10 dark:border-gray-700',
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            {logo && <div className="flex-shrink-0">{logo}</div>}

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={location === item.href}
                />
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">{actions}</div>

            {/* Mobile Menu Button */}
            <MenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        items={items}
        actions={actions}
      />
    </>
  );
}

// ============================================
// Bottom Navigation (Mobile)
// ============================================

interface BottomNavProps {
  items: NavItem[];
  className?: string;
}

export function BottomNav({ items, className }: BottomNavProps) {
  const [location] = useLocation();

  // Only show first 5 items
  const visibleItems = items.slice(0, 5);

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30 lg:hidden',
        'bg-white dark:bg-gray-900 border-t border-white/10 dark:border-gray-700',
        'safe-area-inset-bottom',
        className
      )}
    >
      <div className="flex items-center justify-around h-16">
        {visibleItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors',
                  isActive
                    ? 'text-primary-cyan dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-300'
                )}
              >
                {item.icon && (
                  <span className="relative">
                    {item.icon}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================
// Export all
// ============================================

export default {
  ResponsiveNav,
  BottomNav,
};
