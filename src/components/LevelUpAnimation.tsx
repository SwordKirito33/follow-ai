import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpAnimationProps {
  isVisible: boolean;
  newLevel: number;
  levelName: string;
  onClose: () => void;
}

const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  isVisible,
  newLevel,
  levelName,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'],
        });
      }, 250);

      // Auto close after 5 seconds
      const timeout = setTimeout(() => {
        onClose();
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 text-center relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-conic from-blue-500/10 via-purple-500/10 to-pink-500/10"
                />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Trophy Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Trophy className="w-12 h-12 text-white" />
                </motion.div>

                {/* Level Up Text */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2">
                    LEVEL UP!
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-5xl font-black text-white dark:text-white">
                      {newLevel}
                    </span>
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-lg font-semibold text-gray-400 dark:text-gray-400 mb-6">
                    {levelName}
                  </p>
                </motion.div>

                {/* Sparkles */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-1 text-purple-500 mb-6"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">New abilities unlocked!</span>
                  <Sparkles className="w-4 h-4" />
                </motion.div>

                {/* Close Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
                >
                  Awesome!
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpAnimation;
