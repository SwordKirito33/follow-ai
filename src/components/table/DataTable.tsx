// Data Table Components for Follow.ai
// Comprehensive table with sorting, filtering, and pagination

import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  rowKey?: keyof T;
  onRowClick?: (row: T) => void;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// ============================================
// Data Table Component
// ============================================

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage = '暂无数据',
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  rowKey = 'id' as keyof T,
  onRowClick,
  striped = false,
  hoverable = true,
  bordered = false,
  compact = false,
  className,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  // Handle selection
  const isAllSelected = selectedRows.length === data.length && data.length > 0;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.([...data]);
    }
  };

  const handleSelectRow = (row: T) => {
    const isSelected = selectedRows.some((r) => r[rowKey] === row[rowKey]);
    if (isSelected) {
      onSelectionChange?.(selectedRows.filter((r) => r[rowKey] !== row[rowKey]));
    } else {
      onSelectionChange?.([...selectedRows, row]);
    }
  };

  const isRowSelected = (row: T) => selectedRows.some((r) => r[rowKey] === row[rowKey]);

  // Get cell value
  const getCellValue = (row: T, column: Column<T>, index: number) => {
    const value = row[column.key as keyof T];
    if (column.render) {
      return column.render(value, row, index);
    }
    return String(value ?? '');
  };

  return (
    <div className={cn('overflow-hidden rounded-lg border border-white/10 dark:border-gray-700', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-white/5 dark:bg-gray-800">
            <tr>
              {selectable && (
                <th className={cn('w-12', compact ? 'px-3 py-2' : 'px-4 py-3')}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-white/20 dark:border-gray-600 text-primary-purple focus:ring-purple-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'text-left text-xs font-medium text-gray-400 dark:text-gray-300 uppercase tracking-wider',
                    compact ? 'px-3 py-2' : 'px-4 py-3',
                    column.sortable && 'cursor-pointer select-none hover:text-gray-300 dark:hover:text-gray-300',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-1">
                    {column.title}
                    {column.sortable && (
                      <span className="flex flex-col">
                        <svg
                          className={cn(
                            'w-3 h-3 -mb-1',
                            sortConfig?.key === column.key && sortConfig.direction === 'asc'
                              ? 'text-primary-purple'
                              : 'text-gray-400'
                          )}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 8l-6 6h12z" />
                        </svg>
                        <svg
                          className={cn(
                            'w-3 h-3',
                            sortConfig?.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-primary-purple'
                              : 'text-gray-400'
                          )}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 16l-6-6h12z" />
                        </svg>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {selectable && (
                    <td className={cn(compact ? 'px-3 py-2' : 'px-4 py-3')}>
                      <div className="w-4 h-4 bg-white/10 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={String(column.key)} className={cn(compact ? 'px-3 py-2' : 'px-4 py-3')}>
                      <div className="h-4 bg-white/10 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-400 dark:text-gray-300"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              sortedData.map((row, index) => (
                <tr
                  key={String(row[rowKey])}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors',
                    striped && index % 2 === 1 && 'bg-white/5 dark:bg-gray-800/50',
                    hoverable && 'hover:bg-white/5 dark:hover:bg-gray-800',
                    onRowClick && 'cursor-pointer',
                    isRowSelected(row) && 'bg-purple-50 dark:bg-purple-900/20',
                    bordered && 'border-b border-white/10 dark:border-gray-700'
                  )}
                >
                  {selectable && (
                    <td className={cn(compact ? 'px-3 py-2' : 'px-4 py-3')}>
                      <input
                        type="checkbox"
                        checked={isRowSelected(row)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(row);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-white/20 dark:border-gray-600 text-primary-purple focus:ring-purple-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        'text-sm text-white dark:text-white',
                        compact ? 'px-3 py-2' : 'px-4 py-3',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {getCellValue(row, column, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// Table Cell Components
// ============================================

interface BadgeCellProps {
  value: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function BadgeCell({ value, variant = 'default' }: BadgeCellProps) {
  const variantClasses = {
    default: 'bg-white/10 dark:bg-gray-800 text-gray-300 dark:text-gray-300',
    success: 'bg-accent-green/20 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-accent-gold/20 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info: 'bg-primary-blue/20 dark:bg-blue-900/30 text-primary-blue dark:text-blue-400',
  };

  return (
    <span className={cn('inline-flex px-2 py-1 text-xs font-medium rounded-full', variantClasses[variant])}>
      {value}
    </span>
  );
}

interface AvatarCellProps {
  src?: string;
  name: string;
  subtitle?: string;
}

export function AvatarCell({ src, name, subtitle }: AvatarCellProps) {
  return (
    <div className="flex items-center gap-3">
      {src ? (
        <img loading="lazy" src={src} alt={name} className="w-8 h-8 rounded-full object-cover" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary-purple/20 dark:bg-purple-900/30 flex items-center justify-center">
          <span className="text-sm font-medium text-primary-purple dark:text-purple-400">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div>
        <div className="font-medium text-white dark:text-white">{name}</div>
        {subtitle && <div className="text-xs text-gray-400 dark:text-gray-300">{subtitle}</div>}
      </div>
    </div>
  );
}

interface ActionsCellProps {
  actions: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'danger';
  }>;
}

export function ActionsCell({ actions }: ActionsCellProps) {
  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            action.onClick();
          }}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            action.variant === 'danger'
              ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-gray-400 hover:bg-white/10 dark:hover:bg-gray-800'
          )}
          title={action.label}
        >
          {action.icon || action.label}
        </button>
      ))}
    </div>
  );
}

interface ProgressCellProps {
  value: number;
  max?: number;
  showLabel?: boolean;
}

export function ProgressCell({ value, max = 100, showLabel = true }: ProgressCellProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/10 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-600 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 dark:text-gray-300 min-w-[40px] text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

interface DateCellProps {
  date: Date | string;
  format?: 'date' | 'datetime' | 'relative';
}

export function DateCell({ date, format = 'date' }: DateCellProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const formatDate = () => {
    if (format === 'relative') {
      const now = new Date();
      const diff = now.getTime() - dateObj.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return '刚刚';
      if (minutes < 60) return `${minutes} 分钟前`;
      if (hours < 24) return `${hours} 小时前`;
      if (days < 7) return `${days} 天前`;
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(format === 'datetime' && { hour: '2-digit', minute: '2-digit' }),
    };

    return dateObj.toLocaleDateString('zh-CN', options);
  };

  return (
    <span className="text-gray-400 dark:text-gray-400">{formatDate()}</span>
  );
}

// ============================================
// Export All
// ============================================

export default {
  DataTable,
  BadgeCell,
  AvatarCell,
  ActionsCell,
  ProgressCell,
  DateCell,
};
