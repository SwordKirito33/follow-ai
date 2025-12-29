import React from 'react';

interface FollowLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

const FollowLogo: React.FC<FollowLogoProps> = ({ 
  size = 40, 
  showWordmark = false,
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Main gradient for F */}
          <linearGradient id="fGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="30%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="60%" stopColor="#2563eb" stopOpacity="1" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
          </linearGradient>
          
          {/* Background gradient */}
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="1" />
            <stop offset="50%" stopColor="#1e293b" stopOpacity="1" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Speed/motion gradient on top-right */}
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Background rounded rectangle */}
        <rect
          width="100"
          height="100"
          rx="20"
          fill="url(#bgGradient)"
        />
        
        {/* Speed/motion effect on top-right */}
        <path
          d="M 80 20 L 100 0 L 100 20 Z"
          fill="url(#speedGradient)"
        />
        
        {/* F letter */}
        <text
          x="50"
          y="70"
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
          fontSize="60"
          fontWeight="900"
          fill="url(#fGradient)"
          textAnchor="middle"
          letterSpacing="-0.08em"
          filter="url(#glow)"
        >
          F
        </text>
      </svg>
      
      {/* Wordmark */}
      {showWordmark && (
        <span className="gradient-text font-black text-xl tracking-tight">
          Follow.ai
        </span>
      )}
    </div>
  );
};

export default FollowLogo;

