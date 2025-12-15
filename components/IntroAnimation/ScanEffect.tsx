import React from 'react';
import { motion } from 'framer-motion';

interface ScanEffectProps {
  progress: number; // 0-1
  shouldAnimate: boolean;
}

const ScanEffect: React.FC<ScanEffectProps> = ({ progress, shouldAnimate }) => {
  if (!shouldAnimate) return null;

  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const scanY = progress * viewportHeight;

  return (
    <motion.div
      className="fixed left-0 right-0 pointer-events-none z-50"
      style={{
        top: scanY,
        height: 96, // h-24 = 96px
        background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.4), transparent)',
        mixBlendMode: 'screen',
        boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), inset 0 0 20px rgba(59, 130, 246, 0.3)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 0 && progress < 1 ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    />
  );
};

export default ScanEffect;

