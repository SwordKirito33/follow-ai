import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Star, Check, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Review } from '../types';
import Tooltip from './Tooltip';

interface Props {
  review: Review;
}

const ReviewCard: React.FC<Props> = ({ review }) => {
  const { t } = useLanguage();
  const [likes, setLikes] = useState(review.likes);
  const [isLiked, setIsLiked] = useState(false);

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <img src={review.user.avatar} alt={review.user.name} className="w-10 h-10 rounded-full" />
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900 text-sm">{review.user.name}</h4>
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
        <img src={review.toolLogo} alt={review.toolName} className="w-6 h-6 rounded" />
        <span className="font-semibold text-sm text-gray-800">{review.toolName}</span>
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
      <div className="bg-gray-100 h-48 relative group cursor-pointer overflow-hidden">
        <img src={review.outputImage} alt="Work Output" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-medium border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">{t('reviewCard.viewOutput')}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
          {likes} {t('reviewCard.likes')}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <MessageCircle size={16} />
          {t('reviewCard.reply')}
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;