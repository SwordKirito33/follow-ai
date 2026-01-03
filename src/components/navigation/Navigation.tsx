// Navigation Components for Follow.ai
// Comprehensive navigation system with responsive design

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
  onClick?: () => void;
  disabled?: boolean;
}

interface NavbarProps {
  logo?: React.ReactNode;
  items: NavItem[];
  rightContent?: React.ReactNode;
  sticky?: boolean;
  transparent?: boolean;
  className?: string;
}

interface SidebarProps {
  items: NavItem[];
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

interface TabsProps {
  items: Array<{ id: string; label: string; icon?: React.ReactNode; disabled?: boolean }>;
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

// ============================================
// Navbar Component
// ============================================

export function Navbar({
  logo,
  items,
  rightContent,
  sticky = true,
  transparent = false,
  className,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav
      className={cn(
        'w-full z-40 transition-all duration-300',
        sticky && 'sticky top-0',
        transparent ? 'bg-transparent' : 'bg-white dark:bg-gray-900 shadow-sm',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {logo && <div className="flex-shrink-0">{logo}</div>}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item, index) => (
              <NavItemComponent key={index} item={item} currentPath={location} />
            ))}
          </div>

          {/* Right Content */}
          <div className="hidden md:flex items-center gap-4">
            {rightContent}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <MobileNavItem
                  key={index}
                  item={item}
                  currentPath={location}
                  onClose={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
            {rightContent && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                {rightContent}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

// ============================================
// Nav Item Component
// ============================================

function NavItemComponent({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isActive = item.href === currentPath || item.children?.some((child) => child.href === currentPath);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (item.children) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive
              ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          {item.icon}
          {item.label}
          <svg
            className={cn('w-4 h-4 transition-transform', dropdownOpen && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
            {item.children.map((child, index) => (
              <Link key={index} href={child.href || '#'}>
                <a
                  onClick={() => setDropdownOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                    child.href === currentPath
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
                    child.disabled && 'opacity-50 pointer-events-none'
                  )}
                >
                  {child.icon}
                  {child.label}
                  {child.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                      {child.badge}
                    </span>
                  )}
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.onClick) {
    return (
      <button
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
          item.disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {item.icon}
        {item.label}
        {item.badge && (
          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <Link href={item.href || '#'}>
      <a
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
          item.disabled && 'opacity-50 pointer-events-none'
        )}
      >
        {item.icon}
        {item.label}
        {item.badge && (
          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
            {item.badge}
          </span>
        )}
      </a>
    </Link>
  );
}

// ============================================
// Mobile Nav Item Component
// ============================================

function MobileNavItem({
  item,
  currentPath,
  onClose,
}: {
  item: NavItem;
  currentPath: string;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isActive = item.href === currentPath;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors',
            'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
          <svg
            className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child, index) => (
              <Link key={index} href={child.href || '#'}>
                <a
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors',
                    child.href === currentPath
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                      : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {child.icon}
                  {child.label}
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.href || '#'}>
      <a
        onClick={onClose}
        className={cn(
          'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        {item.icon}
        {item.label}
        {item.badge && (
          <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
            {item.badge}
          </span>
        )}
      </a>
    </Link>
  );
}

// ============================================
// Sidebar Component
// ============================================

export function Sidebar({
  items,
  logo,
  footer,
  collapsed = false,
  onCollapse,
  className,
}: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside
      className={cn(
        'h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
        {!collapsed && logo}
        {onCollapse && (
          <button
            onClick={() => onCollapse(!collapsed)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {items.map((item, index) => (
            <SidebarItem key={index} item={item} currentPath={location} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      {footer && !collapsed && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          {footer}
        </div>
      )}
    </aside>
  );
}

// ============================================
// Sidebar Item Component
// ============================================

function SidebarItem({
  item,
  currentPath,
  collapsed,
}: {
  item: NavItem;
  currentPath: string;
  collapsed: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isActive = item.href === currentPath || item.children?.some((child) => child.href === currentPath);

  if (item.children && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive
              ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <span className="flex items-center gap-3">
            {item.icon}
            {item.label}
          </span>
          <svg
            className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expanded && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children.map((child, index) => (
              <Link key={index} href={child.href || '#'}>
                <a
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    child.href === currentPath
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                      : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {child.icon}
                  {child.label}
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.href || '#'}>
      <a
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
          collapsed && 'justify-center'
        )}
        title={collapsed ? item.label : undefined}
      >
        {item.icon}
        {!collapsed && item.label}
        {!collapsed && item.badge && (
          <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
            {item.badge}
          </span>
        )}
      </a>
    </Link>
  );
}

// ============================================
// Breadcrumb Component
// ============================================

export function Breadcrumb({
  items,
  separator = (
    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  className,
}: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">{separator}</span>}
          {item.href ? (
            <Link href={item.href}>
              <a className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                {item.label}
              </a>
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// ============================================
// Tabs Component
// ============================================

export function Tabs({
  items,
  activeTab,
  onChange,
  variant = 'default',
  className,
}: TabsProps) {
  const variantClasses = {
    default: {
      container: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
      tab: 'px-4 py-2 rounded-md text-sm font-medium transition-all',
      active: 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm',
      inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
    },
    pills: {
      container: 'gap-2',
      tab: 'px-4 py-2 rounded-full text-sm font-medium transition-all',
      active: 'bg-purple-600 text-white',
      inactive: 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
    },
    underline: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px',
      active: 'border-purple-600 text-purple-600 dark:text-purple-400',
      inactive: 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300',
    },
  };

  const classes = variantClasses[variant];

  return (
    <div className={cn('flex', classes.container, className)} role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={activeTab === item.id}
          onClick={() => !item.disabled && onChange(item.id)}
          disabled={item.disabled}
          className={cn(
            classes.tab,
            activeTab === item.id ? classes.active : classes.inactive,
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// Pagination Component
// ============================================

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);

    let start = Math.max(1, currentPage - halfShow);
    let end = Math.min(totalPages, currentPage + halfShow);

    if (currentPage <= halfShow) {
      end = Math.min(totalPages, showPages);
    }
    if (currentPage > totalPages - halfShow) {
      start = Math.max(1, totalPages - showPages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className={cn('flex items-center gap-1', className)} aria-label="Pagination">
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="First page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={cn(
              'min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-purple-600 text-white'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2 text-gray-400">
            {page}
          </span>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Last page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  );
}

// ============================================
// Export All
// ============================================

export default {
  Navbar,
  Sidebar,
  Breadcrumb,
  Tabs,
  Pagination,
};
