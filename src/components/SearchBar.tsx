import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterOptions) => void;
  showAdvanced?: boolean;
}

interface FilterOptions {
  category?: string;
  minRating?: number;
  priceRange?: string;
  useCase?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterChange, showAdvanced = false }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full pl-12 pr-12 py-4 glass-card border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onSearch?.('');
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-400"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <Filter size={16} />
            {t('search.advancedFilters')}
            {Object.keys(filters).length > 0 && (
              <span className="bg-gradient-to-r from-primary-cyan to-primary-blue text-white text-xs px-2 py-0.5 rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="mt-4 glass-card rounded-xl p-4 space-y-4 animate-slideDown">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">{t('search.category')}</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">{t('search.allCategories')}</option>
                    <option value="coding">AI Coding</option>
                    <option value="image">Image Generation</option>
                    <option value="video">Video Generation</option>
                    <option value="writing">AI Writing</option>
                    <option value="audio">Audio & Voice</option>
                    <option value="data">Data & Analytics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">{t('search.minRating')}</label>
                  <select
                    value={filters.minRating || ''}
                    onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">{t('search.anyRating')}</option>
                    <option value="4">4.0+ ⭐</option>
                    <option value="4.5">4.5+ ⭐</option>
                    <option value="4.8">4.8+ ⭐</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">{t('search.useCase')}</label>
                  <select
                    value={filters.useCase || ''}
                    onChange={(e) => handleFilterChange('useCase', e.target.value)}
                    className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">{t('search.allUseCases')}</option>
                    <option value="coding">Coding</option>
                    <option value="design">Design</option>
                    <option value="analysis">Analysis</option>
                    <option value="writing">Writing</option>
                  </select>
                </div>
              </div>

              {Object.keys(filters).length > 0 && (
                <div className="flex items-center justify-end pt-2 border-t border-white/20">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <X size={14} />
                    {t('search.clearFilters')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

