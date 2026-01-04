// Responsive Container Components for Follow-ai
// Provides consistent layout across all pages

import React from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Container Component
// ============================================

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export function Container({
  children,
  size = 'xl',
  className,
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 w-full',
        containerSizes[size],
        className
      )}
    >
      {children}
    </Component>
  );
}

// ============================================
// Page Layout Component
// ============================================

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-slate-800/50/5 dark:bg-gray-900', className)}>
      <Container className="py-6 sm:py-8">
        {breadcrumbs && <div className="mb-4">{breadcrumbs}</div>}
        
        {(title || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              {title && (
                <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-white">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-1 text-gray-400 dark:text-gray-300">{description}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}
        
        {children}
      </Container>
    </div>
  );
}

// ============================================
// Section Component
// ============================================

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Section({
  children,
  title,
  description,
  actions,
  className,
}: SectionProps) {
  return (
    <section className={cn('mb-8', className)}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold text-white dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-gray-400 dark:text-gray-300">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// ============================================
// Card Component
// ============================================

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const cardPadding = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export function Card({
  children,
  title,
  description,
  actions,
  footer,
  padding = 'md',
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-slate-800/50 dark:bg-gray-800 rounded-xl border border-white/10 dark:border-gray-700 shadow-sm',
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 dark:border-gray-700">
          <div>
            {title && (
              <h3 className="font-semibold text-white dark:text-white">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-gray-400 dark:text-gray-300">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      
      <div className={cardPadding[padding]}>{children}</div>
      
      {footer && (
        <div className="px-4 sm:px-6 py-4 border-t border-white/10 dark:border-gray-700 bg-slate-800/50/5 dark:bg-gray-800/50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
}

// ============================================
// Grid Component
// ============================================

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
};

const gridGap = {
  sm: 'gap-3',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
};

export function Grid({ children, cols = 3, gap = 'md', className }: GridProps) {
  return (
    <div className={cn('grid', gridCols[cols], gridGap[gap], className)}>
      {children}
    </div>
  );
}

// ============================================
// Stack Component
// ============================================

interface StackProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  className?: string;
}

const stackGap = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

const stackAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const stackJustify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export function Stack({
  children,
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
}: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        stackGap[gap],
        stackAlign[align],
        stackJustify[justify],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// Divider Component
// ============================================

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return (
    <div
      className={cn(
        'bg-slate-800/50/10 dark:bg-gray-700',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  );
}

// ============================================
// Spacer Component
// ============================================

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const spacerSizes = {
  xs: 'h-2',
  sm: 'h-4',
  md: 'h-6',
  lg: 'h-8',
  xl: 'h-12',
};

export function Spacer({ size = 'md' }: SpacerProps) {
  return <div className={spacerSizes[size]} />;
}

// ============================================
// Two Column Layout
// ============================================

interface TwoColumnLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sidebarWidths = {
  sm: 'lg:w-64',
  md: 'lg:w-80',
  lg: 'lg:w-96',
};

export function TwoColumnLayout({
  children,
  sidebar,
  sidebarPosition = 'right',
  sidebarWidth = 'md',
  className,
}: TwoColumnLayoutProps) {
  return (
    <div className={cn('flex flex-col lg:flex-row gap-6', className)}>
      {sidebarPosition === 'left' && (
        <aside className={cn('lg:flex-shrink-0', sidebarWidths[sidebarWidth])}>
          {sidebar}
        </aside>
      )}
      <main className="flex-1 min-w-0">{children}</main>
      {sidebarPosition === 'right' && (
        <aside className={cn('lg:flex-shrink-0', sidebarWidths[sidebarWidth])}>
          {sidebar}
        </aside>
      )}
    </div>
  );
}

// ============================================
// Export all
// ============================================

export default {
  Container,
  PageLayout,
  Section,
  Card,
  Grid,
  Stack,
  Divider,
  Spacer,
  TwoColumnLayout,
};
