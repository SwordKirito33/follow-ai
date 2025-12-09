import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const IntroAnimation: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // 检查是否已经看过入场动画
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro === 'true') {
      return;
    }

    setIsVisible(true);
    
    // 步骤1: Logo淡入和缩放 (0-1s)
    setTimeout(() => setCurrentStep(1), 100);
    
    // 步骤2: Logo发光效果 (1-2s)
    setTimeout(() => setCurrentStep(2), 1000);
    
    // 步骤3: 文字淡入 (2-3s)
    setTimeout(() => setCurrentStep(3), 2000);
    
    // 步骤4: 允许跳过 (2.5s后)
    setTimeout(() => setCanSkip(true), 2500);
    
    // 步骤5: 淡出并移除 (3.5s后)
    setTimeout(() => {
      setCurrentStep(4);
      setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('hasSeenIntro', 'true');
      }, 500);
    }, 3500);
  }, []);

  const handleSkip = () => {
    setCurrentStep(4);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('hasSeenIntro', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center overflow-hidden"
      style={{
        animation: currentStep === 4 ? 'fadeOut 0.5s ease-out forwards' : 'fadeIn 0.3s ease-out'
      }}
    >
      {/* 动态背景粒子效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* 中心内容 */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo容器 */}
        <div 
          className="relative mb-8"
          style={{
            opacity: currentStep >= 1 ? 1 : 0,
            transform: currentStep >= 1 
              ? `scale(${currentStep >= 2 ? 1.1 : 1})` 
              : 'scale(0.5)',
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Logo外层光晕 */}
          <div 
            className="absolute inset-0 rounded-2xl blur-3xl"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
              opacity: currentStep >= 2 ? 0.6 : 0,
              transform: 'scale(1.5)',
              transition: 'opacity 0.8s ease-out',
              animation: currentStep >= 2 ? 'pulse 2s ease-in-out infinite' : 'none'
            }}
          />
          
          {/* Logo主体 */}
          <div 
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
            style={{
              boxShadow: currentStep >= 2 
                ? '0 0 60px rgba(59, 130, 246, 0.6), 0 0 100px rgba(139, 92, 246, 0.4)' 
                : '0 0 20px rgba(59, 130, 246, 0.3)',
              transition: 'box-shadow 0.8s ease-out'
            }}
          >
            {/* 内部渐变光效 */}
            <div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent"
              style={{
                opacity: currentStep >= 2 ? 1 : 0,
                transition: 'opacity 0.8s ease-out'
              }}
            />
            
            {/* F字母 */}
            <span 
              className="relative text-white font-bold text-6xl md:text-7xl z-10"
              style={{
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              F
            </span>
          </div>
        </div>

        {/* 文字动画 */}
        <div 
          className="text-center"
          style={{
            opacity: currentStep >= 3 ? 1 : 0,
            transform: currentStep >= 3 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out'
          }}
        >
          <h1 
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            style={{
              background: 'linear-gradient(135deg, #ffffff, #e0e7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Follow.ai
          </h1>
          <p className="text-blue-200 text-sm md:text-base font-medium">
            {t('intro.tagline') || 'Where AI Tools Show Their Real Work'}
          </p>
        </div>
      </div>

      {/* 跳过按钮 */}
      {canSkip && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10"
          style={{
            opacity: canSkip ? 1 : 0,
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {t('intro.skip') || 'Skip'}
        </button>
      )}

      {/* 加载进度条（可选） */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{
            width: currentStep >= 4 ? '100%' : `${(currentStep / 4) * 100}%`,
            transition: 'width 0.1s linear'
          }}
        />
      </div>
    </div>
  );
};

export default IntroAnimation;

