import React from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, DollarSign } from 'lucide-react';
import Badge from './ui/Badge';

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    logo: string;
    category: string;
    rating: number;
    reviewCount: number;
    growth?: string;
    description?: string;
    useCases?: string[];
    hasBounty?: boolean;
    bountyAmount?: number;
  };
  rank?: number;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, rank }) => {
  return (
    <Link
      to={`/tool/${tool.id}`}
      className="group block glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 card-3d"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <img
            src={tool.logo}
            alt={tool.name}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight truncate">
                {tool.name}
              </h3>
              {rank && rank <= 3 && (
                <Badge variant={rank === 1 ? 'warning' : rank === 2 ? 'default' : 'info'} size="sm">
                  #{rank}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {tool.description || `${tool.category} tool`}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} className="fill-current" />
                <span className="font-bold text-gray-900 dark:text-white">{tool.rating}</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                {tool.reviewCount} reviews
              </span>
              {tool.growth && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                  <TrendingUp size={14} />
                  {tool.growth}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Use Cases */}
      {tool.useCases && tool.useCases.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.useCases.slice(0, 3).map((useCase, idx) => (
            <Badge key={idx} variant="info" size="sm">
              {useCase}
            </Badge>
          ))}
          {tool.useCases.length > 3 && (
            <Badge variant="default" size="sm">
              +{tool.useCases.length - 3}
            </Badge>
          )}
        </div>
      )}
      
      {/* Bounty Badge */}
      {tool.hasBounty && tool.bountyAmount && (
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg mb-4 border border-green-200 dark:border-green-800">
          <DollarSign size={16} className="text-green-600 dark:text-green-400" />
          <span className="text-sm font-bold text-green-700 dark:text-green-400">
            Active bounty: ${tool.bountyAmount}
          </span>
        </div>
      )}
      
      {/* Category Badge */}
      <div className="flex items-center justify-between">
        <Badge variant="default" size="sm">
          {tool.category}
        </Badge>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
          View tool →
        </span>
      </div>
    </Link>
  );
};

export default ToolCard;

