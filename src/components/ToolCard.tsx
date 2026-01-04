import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, DollarSign, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Badge from './ui/Badge';
import LazyImage from './LazyImage';

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
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      setIsFavorited(!isFavorited);
    }
  };

  return (
    <div className="group glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 card-3d relative">
      <Link
        to={`/tool/${tool.id}`}
        className="block"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <LazyImage
              src={tool.logo}
              alt={tool.name}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-black text-white dark:text-white tracking-tight truncate">
                {tool.name}
              </h3>
              {rank && rank <= 3 && (
                <Badge variant={rank === 1 ? 'warning' : rank === 2 ? 'default' : 'info'} size="sm">
                  #{rank}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-400 mb-2 line-clamp-2">
              {tool.description || `${tool.category} tool`}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} className="fill-current" />
                <span className="font-bold text-white dark:text-white">{tool.rating}</span>
              </div>
              <span className="text-gray-400 dark:text-gray-300">
                {tool.reviewCount} reviews
              </span>
              {tool.growth && (
                <span className="flex items-center gap-1 text-accent-green dark:text-green-400 font-semibold">
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
          <DollarSign size={16} className="text-accent-green dark:text-green-400" />
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
        <span className="text-sm font-semibold text-primary-cyan dark:text-blue-400 group-hover:text-primary-blue dark:group-hover:text-blue-300 transition-colors">
          View tool →
        </span>
      </div>
      </Link>
      
      {/* Favorite Button */}
      {isAuthenticated && (
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
            isFavorited
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-600 dark:hover:text-red-400'
          }`}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
        </button>
      )}
    </div>
  );
};

export default ToolCard;

