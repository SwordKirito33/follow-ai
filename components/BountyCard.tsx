import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Clock, Users, Zap } from 'lucide-react';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  deadline: string;
  slots: {
    total: number;
    filled: number;
  };
  requirements?: string[];
  priority?: 'high' | 'medium' | 'low';
}

interface BountyCardProps {
  bounty: Bounty;
  toolId?: string;
  toolName?: string;
}

const BountyCard: React.FC<BountyCardProps> = ({ bounty, toolId, toolName }) => {
  const slotsRemaining = bounty.slots.total - bounty.slots.filled;
  const isUrgent = bounty.priority === 'high' || slotsRemaining <= 2;
  const deadlineDate = new Date(bounty.deadline);
  const daysRemaining = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
              {bounty.title}
            </h3>
            {isUrgent && (
              <Badge variant="danger" size="sm">
                Urgent
              </Badge>
            )}
            {bounty.priority === 'high' && (
              <Badge variant="warning" size="sm">
                High Priority
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {bounty.description}
          </p>
        </div>
      </div>
      
      {/* Reward and Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <DollarSign size={18} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="text-lg font-black text-green-600 dark:text-green-400">
              ${bounty.reward}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Reward</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Clock size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-lg font-black text-gray-900 dark:text-white">
              {daysRemaining}d
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Remaining</div>
          </div>
        </div>
      </div>
      
      {/* Slots */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Users size={14} />
            {slotsRemaining} slots remaining
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            {bounty.slots.filled}/{bounty.slots.total} filled
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(bounty.slots.filled / bounty.slots.total) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Requirements */}
      {bounty.requirements && bounty.requirements.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Requirements:</p>
          <ul className="space-y-1">
            {bounty.requirements.map((req, idx) => (
              <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* CTA */}
      <Button
        to={`/submit?tool=${toolId}&bounty=${bounty.id}`}
        as="link"
        variant="primary"
        size="md"
        className="w-full"
      >
        <Zap size={18} className="mr-2" />
        Submit Output
      </Button>
    </div>
  );
};

export default BountyCard;

