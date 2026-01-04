// Tool Filters Component for Follow-ai
// Advanced filtering and sorting for AI tools

import React, { useState, useCallback } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterState {
  categories: string[];
  pricing: string[];
  rating: number | null;
  tags: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: string;
}

interface ToolFiltersProps {
  categories: FilterOption[];
  pricingOptions: FilterOption[];
  tags: FilterOption[];
  sortOptions: FilterOption[];
  initialFilters?: Partial<FilterState>;
  onFilterChange: (filters: FilterState) => void;
  totalResults?: number;
  className?: string;
}

// ============================================
// Default Options
// ============================================

const defaultCategories: FilterOption[] = [
  { value: 'chatbot', label: '聊天机器人', count: 45 },
  { value: 'image-generation', label: '图像生成', count: 32 },
  { value: 'writing', label: '写作助手', count: 28 },
  { value: 'coding', label: '编程工具', count: 24 },
  { value: 'video', label: '视频制作', count: 18 },
  { value: 'audio', label: '音频处理', count: 15 },
  { value: 'search', label: '智能搜索', count: 12 },
  { value: 'productivity', label: '生产力', count: 35 },
  { value: 'design', label: '设计工具', count: 22 },
  { value: 'marketing', label: '营销工具', count: 16 },
];

const defaultPricingOptions: FilterOption[] = [
  { value: 'free', label: '免费', count: 89 },
  { value: 'freemium', label: '免费增值', count: 124 },
  { value: 'paid', label: '付费', count: 67 },
];

const defaultSortOptions: FilterOption[] = [
  { value: 'popular', label: '最受欢迎' },
  { value: 'rating', label: '评分最高' },
  { value: 'newest', label: '最新添加' },
  { value: 'reviews', label: '评价最多' },
  { value: 'name', label: '名称排序' },
];

// ============================================
// Filter Section Component
// ============================================

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

function FilterSection({ title, children, collapsible = true, defaultExpanded = true }: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-white/10 dark:border-gray-700 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center justify-between w-full text-left',
          collapsible && 'cursor-pointer'
        )}
        disabled={!collapsible}
      >
        <h3 className="font-semibold text-white dark:text-white">{title}</h3>
        {collapsible && (
          <svg
            className={cn(
              'w-5 h-5 text-gray-400 transition-transform',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  );
}

// ============================================
// Checkbox Filter Component
// ============================================

interface CheckboxFilterProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxVisible?: number;
}

function CheckboxFilter({ options, selected, onChange, maxVisible = 5 }: CheckboxFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      {visibleOptions.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => handleToggle(option.value)}
            className="w-4 h-4 rounded border-white/20 dark:border-gray-600 text-primary-purple focus:ring-purple-500"
          />
          <span className="text-sm text-gray-300 dark:text-gray-300 group-hover:text-white dark:group-hover:text-white">
            {option.label}
          </span>
          {option.count !== undefined && (
            <span className="text-xs text-gray-400 dark:text-gray-400 ml-auto">
              {option.count}
            </span>
          )}
        </label>
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary-purple dark:text-purple-400 hover:underline mt-2"
        >
          {showAll ? '收起' : `显示全部 (${options.length})`}
        </button>
      )}
    </div>
  );
}

// ============================================
// Rating Filter Component
// ============================================

interface RatingFilterProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

function RatingFilter({ value, onChange }: RatingFilterProps) {
  const ratings = [4, 3, 2, 1];

  return (
    <div className="space-y-2">
      {ratings.map((rating) => (
        <label
          key={rating}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="radio"
            name="rating"
            checked={value === rating}
            onChange={() => onChange(value === rating ? null : rating)}
            className="w-4 h-4 border-white/20 dark:border-gray-600 text-primary-purple focus:ring-purple-500"
          />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={cn(
                  'w-4 h-4',
                  star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-400'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-400 dark:text-gray-400 ml-1">
              及以上
            </span>
          </div>
        </label>
      ))}
    </div>
  );
}

// ============================================
// Tool Filters Component
// ============================================

export function ToolFilters({
  categories = defaultCategories,
  pricingOptions = defaultPricingOptions,
  tags = [],
  sortOptions = defaultSortOptions,
  initialFilters,
  onFilterChange,
  totalResults,
  className,
}: ToolFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    pricing: [],
    rating: null,
    tags: [],
    sortBy: 'popular',
    sortOrder: 'desc',
    search: '',
    ...initialFilters,
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      const newFilters = { ...filters, ...updates };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      pricing: [],
      rating: null,
      tags: [],
      sortBy: 'popular',
      sortOrder: 'desc',
      search: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount =
    filters.categories.length +
    filters.pricing.length +
    filters.tags.length +
    (filters.rating ? 1 : 0);

  const FilterContent = () => (
    <>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder="搜索工具..."
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-lg',
              'bg-white/10 dark:bg-gray-700',
              'border border-transparent',
              'focus:border-purple-500 focus:ring-1 focus:ring-purple-500',
              'text-white dark:text-white',
              'placeholder-gray-500'
            )}
          />
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 dark:text-gray-300">
              已选 {activeFilterCount} 个筛选条件
            </span>
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-purple dark:text-purple-400 hover:underline"
            >
              清除全部
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map((cat) => {
              const option = categories.find((c) => c.value === cat);
              return (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-purple/20 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs"
                >
                  {option?.label || cat}
                  <button
                    onClick={() =>
                      updateFilters({
                        categories: filters.categories.filter((c) => c !== cat),
                      })
                    }
                    className="hover:text-purple-900 dark:hover:text-purple-100"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              );
            })}
            {filters.pricing.map((price) => {
              const option = pricingOptions.find((p) => p.value === price);
              return (
                <span
                  key={price}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-green/20 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs"
                >
                  {option?.label || price}
                  <button
                    onClick={() =>
                      updateFilters({
                        pricing: filters.pricing.filter((p) => p !== price),
                      })
                    }
                    className="hover:text-green-900 dark:hover:text-green-100"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              );
            })}
            {filters.rating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-gold/20 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs">
                {filters.rating}+ 星
                <button
                  onClick={() => updateFilters({ rating: null })}
                  className="hover:text-yellow-900 dark:hover:text-yellow-100"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sort */}
      <FilterSection title="排序方式" collapsible={false}>
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilters({ sortBy: e.target.value })}
          className={cn(
            'w-full px-3 py-2 rounded-lg',
            'bg-white/10 dark:bg-gray-700',
            'border border-transparent',
            'focus:border-purple-500 focus:ring-1 focus:ring-purple-500',
            'text-white dark:text-white'
          )}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="分类">
        <CheckboxFilter
          options={categories}
          selected={filters.categories}
          onChange={(categories) => updateFilters({ categories })}
        />
      </FilterSection>

      {/* Pricing */}
      <FilterSection title="定价">
        <CheckboxFilter
          options={pricingOptions}
          selected={filters.pricing}
          onChange={(pricing) => updateFilters({ pricing })}
        />
      </FilterSection>

      {/* Rating */}
      <FilterSection title="评分">
        <RatingFilter
          value={filters.rating}
          onChange={(rating) => updateFilters({ rating })}
        />
      </FilterSection>

      {/* Tags */}
      {tags.length > 0 && (
        <FilterSection title="标签">
          <CheckboxFilter
            options={tags}
            selected={filters.tags}
            onChange={(tags) => updateFilters({ tags })}
          />
        </FilterSection>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div
        className={cn(
          'hidden lg:block',
          'bg-white dark:bg-gray-800',
          'rounded-xl p-6',
          'border border-white/10 dark:border-gray-700',
          className
        )}
      >
        {totalResults !== undefined && (
          <div className="mb-4 pb-4 border-b border-white/10 dark:border-gray-700">
            <span className="text-sm text-gray-400 dark:text-gray-300">
              找到 <strong className="text-white dark:text-white">{totalResults}</strong> 个工具
            </span>
          </div>
        )}
        <FilterContent />
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={cn(
          'lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40',
          'flex items-center gap-2 px-6 py-3',
          'bg-purple-600 text-white font-medium rounded-full shadow-lg',
          'hover:bg-purple-700 transition-colors'
        )}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        筛选
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-white text-primary-purple text-xs flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-white/10 dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white dark:text-white">
                筛选
              </h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-white/10 dark:hover:bg-gray-700 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-white/10 dark:border-gray-700 p-4">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                应用筛选 {totalResults !== undefined && `(${totalResults} 个结果)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// Export
// ============================================

export default ToolFilters;
