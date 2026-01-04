import React from 'react';
import { TaskFormData, TaskType } from './TaskTypeSelector';

interface TaskFormProps {
  formData: TaskFormData;
  onChange: (data: TaskFormData) => void;
  errors: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ formData, onChange, errors }) => {
  const handleChange = (field: keyof TaskFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="glass-card rounded-xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Task Details</h2>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-2">
            Task Title <span className="text-red-500">*</span>
            <span className="text-xs text-gray-400 font-normal ml-2">(max 100 characters)</span>
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            maxLength={100}
            placeholder="e.g., Review AI Tool X"
            className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <div className="text-xs text-gray-400 mt-1">
            {formData.title.length}/100 characters
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-2">
            Task Description <span className="text-red-500">*</span>
            <span className="text-xs text-gray-400 font-normal ml-2">(Markdown supported)</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={6}
            placeholder="Describe what testers need to do..."
            className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-semibold text-gray-300 mb-2">
            Requirements <span className="text-red-500">*</span>
            <span className="text-xs text-gray-400 font-normal ml-2">(Markdown supported)</span>
          </label>
          <textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => handleChange('requirements', e.target.value)}
            rows={6}
            placeholder="List the specific requirements for this task..."
            className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Reward */}
        {formData.taskType === 'xp' ? (
          <div>
            <label htmlFor="xpReward" className="block text-sm font-semibold text-gray-300 mb-2">
              XP Reward <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 font-normal ml-2">(10-1000 XP)</span>
            </label>
            <input
              id="xpReward"
              type="number"
              value={formData.xpReward || ''}
              onChange={(e) => handleChange('xpReward', parseInt(e.target.value) || 0)}
              min={10}
              max={1000}
              placeholder="e.g., 100"
              className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="paymentAmount" className="block text-sm font-semibold text-gray-300 mb-2">
              Payment Amount (USD) <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 font-normal ml-2">($10-$10,000)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                id="paymentAmount"
                type="number"
                value={formData.paymentAmount || ''}
                onChange={(e) => handleChange('paymentAmount', parseFloat(e.target.value) || 0)}
                min={10}
                max={10000}
                step="0.01"
                placeholder="e.g., 50.00"
                className="w-full pl-8 pr-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskForm;

