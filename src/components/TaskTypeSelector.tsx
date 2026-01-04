import React from 'react';
import { Zap, DollarSign } from 'lucide-react';
import FollowButton from './ui/follow-button';

export type TaskType = 'xp' | 'paid';

interface TaskTypeSelectorProps {
  selectedType: TaskType;
  onTypeChange: (type: TaskType) => void;
  userLevel: number;
}

const TaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  userLevel,
}) => {
  return (
    <div className="glass-card rounded-xl shadow-xl p-6 mb-8">
      <h2 className="text-xl font-black text-white mb-4 tracking-tight">Task Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* XP Task */}
        <button
          onClick={() => onTypeChange('xp')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selectedType === 'xp'
              ? 'bg-blue-50 border-blue-500 shadow-md'
              : 'bg-white border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${selectedType === 'xp' ? 'bg-primary-blue/20 text-primary-cyan' : 'bg-white/10 text-gray-400'}`}>
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">XP Task</h3>
              <p className="text-sm text-gray-400">Pay with XP</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            Perfect for simple tasks like reviews, feedback, and testing.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>✓ No level requirement</span>
          </div>
        </button>

        {/* Paid Task */}
        <button
          onClick={() => onTypeChange('paid')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selectedType === 'paid'
              ? 'bg-green-50 border-green-500 shadow-md'
              : 'bg-white border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${selectedType === 'paid' ? 'bg-accent-green/20 text-accent-green' : 'bg-white/10 text-gray-400'}`}>
              <DollarSign size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Paid Task</h3>
              <p className="text-sm text-gray-400">Pay with real money</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            For complex tasks like development, design, and consulting.
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <div>Level 5+: &lt;$50 tasks</div>
            <div>Level 10+: $50-$200 tasks</div>
            <div>Level 15+: $200+ tasks</div>
          </div>
          {userLevel < 5 && (
            <div className="mt-2 text-xs text-orange-600 font-semibold">
              ⚠️ You need Level {userLevel < 5 ? 5 : userLevel < 10 ? 10 : 15} to post paid tasks
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskTypeSelector;

