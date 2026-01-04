import React from 'react';
import { Filter, SortAsc } from 'lucide-react';
import { TaskFilters, TaskFilterType, TaskFilterLevel, TaskFilterStatus, TaskSortOption } from '@/lib/task-filters';
import FollowButton from './ui/follow-button';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

const TaskFiltersComponent: React.FC<TaskFiltersProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="glass-card rounded-xl shadow-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-blue/20 p-2 rounded-lg text-primary-cyan">
          <Filter size={20} />
        </div>
        <h2 className="text-xl font-black text-white tracking-tight">Filters & Sort</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Task Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Task Type</label>
          <select
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value as TaskFilterType)}
            className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">All Tasks</option>
            <option value="xp">XP Tasks</option>
            <option value="paid">Paid Tasks</option>
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Level</label>
          <select
            value={filters.level}
            onChange={(e) => updateFilter('level', e.target.value as TaskFilterLevel)}
            className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">All Levels</option>
            <option value="available">I Can Do</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value as TaskFilterStatus)}
            className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            <SortAsc size={14} className="inline mr-1" />
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value as TaskSortOption)}
            className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="reward_high">Highest Reward</option>
            <option value="level_low">Lowest Level</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFiltersComponent;

