import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface CardProps {
  index: number;
  isVerified: boolean;
  spawnX: number;
  spawnY: number;
  spawnRotation: number;
  targetX: number;
  targetY: number;
  targetRotation: number;
  isMobile: boolean;
  shouldAnimate: boolean;
  scanProgress: number; // 0-1, how far the scan has progressed relative to this card
}

const Card: React.FC<CardProps> = ({
  index,
  isVerified,
  spawnX,
  spawnY,
  spawnRotation,
  targetX,
  targetY,
  targetRotation,
  isMobile,
  shouldAnimate,
  scanProgress,
}) => {
  const cardWidth = isMobile ? 100 : 140;
  const cardHeight = isMobile ? 65 : 90;

  // Determine if scan has passed this card
  const cardCenterY = targetY + cardHeight / 2;
  const scanY = scanProgress * (typeof window !== 'undefined' ? window.innerHeight : 1000);
  const isScanned = scanY >= cardCenterY - 20;

  // Animation variants
  const cardVariants = {
    spawn: {
      x: spawnX,
      y: spawnY,
      rotate: spawnRotation,
      opacity: 0,
      scale: 0.8,
    },
    inGrid: {
      x: targetX,
      y: targetY,
      rotate: targetRotation,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        delay: index * 0.03,
      },
    },
    verified: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.5, 1],
      },
    },
  };

  const backgroundGradient = isScanned || isVerified
    ? 'from-blue-400 to-blue-600'
    : 'from-slate-800/60 to-slate-900/60';

  return (
    <motion.div
      variants={shouldAnimate ? cardVariants : {}}
      initial="spawn"
      animate={isScanned || isVerified ? 'verified' : 'inGrid'}
      className={`absolute rounded-xl shadow-lg shadow-blue-500/10 overflow-hidden`}
      style={{
        width: cardWidth,
        height: cardHeight,
      }}
    >
      {/* Card Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient} transition-all duration-300`}
      />

      {/* Optional Bounty Icon */}
      {Math.random() > 0.7 && (
        <div className="absolute top-2 right-2 z-10">
          <DollarSign
            size={12}
            className={`${
              isScanned || isVerified ? 'text-blue-100' : 'text-slate-400'
            } transition-colors duration-300`}
          />
        </div>
      )}

      {/* Card Content */}
      <div className="relative h-full p-2 flex flex-col">
        {/* Prompt Label */}
        <div className="text-[10px] uppercase tracking-wide text-slate-300 mb-1">
          Prompt
        </div>

        {/* Text Lines */}
        <div className="flex-1 space-y-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded ${
                isScanned || isVerified
                  ? 'bg-blue-300/40'
                  : 'bg-slate-600'
              } transition-colors duration-300`}
              style={{
                width: `${60 + Math.random() * 40}%`,
              }}
            />
          ))}
        </div>

        {/* Badge */}
        <div className="mt-auto">
          {isScanned || isVerified ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/80 text-blue-100 text-[9px] font-medium">
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                className="flex-shrink-0"
              >
                <path
                  d="M6.5 2L3 5.5L1.5 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Verified
            </div>
          ) : (
            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 text-[9px] font-medium">
              Unverified
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;

