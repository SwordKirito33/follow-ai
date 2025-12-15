import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Star, Check, Info, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Review } from '../types';
import Tooltip from './Tooltip';
import LazyImage from './LazyImage';

interface Props {
  review: Review;
}

const ReviewCard: React.FC<Props> = ({ review }) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [likes, setLikes] = useState(review.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden card-3d hover:shadow-2xl transition-all duration-300 group">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <img src={review.user.avatar} alt={review.user.name} className="w-10 h-10 rounded-full" />
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-black text-gray-900 text-sm tracking-tight">{review.user.name}</h4>
            <Tooltip content={t('reviewCard.levelBasedOn')}>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded cursor-help">
                {review.user.levelName}
              </span>
            </Tooltip>
          </div>
          <p className="text-xs text-gray-500">{review.timeAgo}</p>
        </div>
      </div>

      {/* Tool Info */}
      <div className="px-4 pb-3 flex items-center gap-2">
        <LazyImage src={review.toolLogo} alt={review.toolName} className="w-6 h-6 rounded" />
        <span className="font-bold text-sm text-gray-800 tracking-tight">{review.toolName}</span>
        <span className="text-xs text-gray-400">• {review.toolCategory}</span>
      </div>

      {/* Rating & Quality */}
      <div className="px-4 flex items-center justify-between mb-3">
        <div className="flex items-center text-amber-500">
          {[...Array(5)].map((_, i) => (
             <Star key={i} size={14} fill={i < Math.floor(review.rating) ? "currentColor" : "none"} className={i < Math.floor(review.rating) ? "" : "text-gray-300"} />
          ))}
          <span className="ml-1 text-sm font-bold text-gray-700">{review.rating}</span>
        </div>
        <Tooltip content={t('reviewCard.aiAnalyzedScore')}>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 cursor-help">
            <Check size={12} strokeWidth={3} />
            {t('reviewCard.quality')}: {review.qualityScore}/10
          </div>
        </Tooltip>
      </div>

      {/* Review Text */}
      <div className="px-4 mb-3">
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {review.text}
        </p>
      </div>

      {/* Output Preview */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 relative cursor-pointer overflow-hidden">
        <LazyImage
          src={review.outputImage}
          alt="Work Output"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium border-2 border-white/70 px-6 py-3 rounded-full backdrop-blur-md bg-white/10 transform scale-90 group-hover:scale-100 transition-transform duration-300">{t('reviewCard.viewOutput')}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            disabled={!isAuthenticated}
          >
            <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
            {likes} {t('reviewCard.likes')}
          </button>
          <button 
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
            disabled={!isAuthenticated}
          >
            <MessageCircle size={16} />
            {t('reviewCard.reply')}
          </button>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`p-1.5 rounded transition-colors ${
              isFavorited
                ? 'text-red-600 hover:text-red-700'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;