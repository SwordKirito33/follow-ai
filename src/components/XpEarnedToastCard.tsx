import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getSourceMeta, type GamificationConfig } from '@/lib/gamification';
import type { XpSource } from '@/lib/gamification';

interface XpEarnedToastCardProps {
  gained: number;
  sources: XpSource[];
  config: GamificationConfig;
  onClose: () => void;
}

const XpEarnedToastCard: React.FC<XpEarnedToastCardProps> = ({
  gained,
  sources,
  config,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10 p-4 min-w-[280px] max-w-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-2xl font-black text-primary-cyan mb-1">
            +{gained} XP
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((source) => {
              const meta = getSourceMeta(source, config.xp_sources);
              return (
                <span
                  key={source}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg text-xs font-semibold text-gray-300"
                >
                  {meta.emoji && <span>{meta.emoji}</span>}
                  <span>{meta.label}</span>
                </span>
              );
            })}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default XpEarnedToastCard;

