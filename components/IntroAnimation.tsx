import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const IntroAnimation: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 检查是否已经看过入场动画
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro === 'true') {
      return;
    }

    setIsVisible(true);
    
    // 步骤1: 网格背景出现 (0-0.5s)
    setTimeout(() => setCurrentStep(1), 100);
    
    // 步骤2: Logo从中心爆发出现 (0.5-1.5s)
    setTimeout(() => setCurrentStep(2), 500);
    
    // 步骤3: Logo发光和旋转 (1.5-2.5s)
    setTimeout(() => setCurrentStep(3), 1500);
    
    // 步骤4: 粒子爆发效果 (2-2.5s)
    setTimeout(() => setCurrentStep(4), 2000);
    
    // 步骤5: 文字和光效 (2.5-3.5s)
    setTimeout(() => setCurrentStep(5), 2500);
    
    // 步骤6: 允许跳过 (3s后)
    setTimeout(() => setCanSkip(true), 3000);
    
    // 步骤7: 淡出并移除 (4.5s后)
    setTimeout(() => {
      setCurrentStep(6);
      setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('hasSeenIntro', 'true');
      }, 800);
    }, 4500);
  }, []);

  // Canvas粒子效果
  useEffect(() => {
    if (!canvasRef.current || currentStep < 4) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }> = [];

    // 从Logo中心创建粒子
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 3 + 2;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        size: Math.random() * 3 + 1,
      });
    }

    let animationFrame: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        if (particle.life >= particle.maxLife) {
          particles.splice(i, 1);
          return;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.life++;

        const opacity = 1 - particle.life / particle.maxLife;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (particles.length > 0 && currentStep >= 4 && currentStep < 6) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [currentStep]);

  const handleSkip = () => {
    setCurrentStep(6);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('hasSeenIntro', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[#0a0a0f] flex items-center justify-center overflow-hidden"
      style={{
        animation: currentStep === 6 ? 'fadeOut 0.8s ease-out forwards' : 'fadeIn 0.3s ease-out'
      }}
    >
      {/* 动态网格背景 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: currentStep >= 1 ? 0.3 : 0,
          transition: 'opacity 0.5s ease-out',
          animation: currentStep >= 1 ? 'gridPulse 3s ease-in-out infinite' : 'none'
        }}
      />

      {/* 径向渐变光效 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: currentStep >= 3 
            ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
            : 'transparent',
          transition: 'background 0.8s ease-out',
          animation: currentStep >= 3 ? 'pulse 2s ease-in-out infinite' : 'none'
        }}
      />

      {/* Canvas粒子效果 */}
      {currentStep >= 4 && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />
      )}

      {/* 中心内容 */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo容器 - 使用你的logo设计 */}
        <div 
          className="relative mb-12"
          style={{
            opacity: currentStep >= 2 ? 1 : 0,
            transform: currentStep >= 2 
              ? `scale(${currentStep >= 3 ? 1 : 0}) rotate(${currentStep >= 3 ? '360deg' : '0deg'})` 
              : 'scale(0)',
            transition: currentStep === 2 
              ? 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
              : currentStep >= 3
              ? 'transform 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
              : 'all 0.3s ease-out'
          }}
        >
          {/* 多层光晕效果 */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[3, 2, 1].map((layer, idx) => (
              <div
                key={idx}
                className="absolute rounded-2xl"
                style={{
                  width: `${200 + layer * 40}px`,
                  height: `${200 + layer * 40}px`,
                  background: `radial-gradient(circle, rgba(59, 130, 246, ${0.4 - idx * 0.1}) 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                  opacity: currentStep >= 3 ? 1 : 0,
                  transform: `scale(${1 + layer * 0.1})`,
                  animation: currentStep >= 3 ? `pulse ${2 + idx * 0.5}s ease-in-out infinite` : 'none',
                  transition: 'opacity 0.8s ease-out'
                }}
              />
            ))}
          </div>

          {/* Logo主体 - 深色背景上的蓝色渐变F */}
          <div 
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1e 100%)',
              boxShadow: currentStep >= 3
                ? `
                  0 0 80px rgba(59, 130, 246, 0.8),
                  0 0 120px rgba(59, 130, 246, 0.5),
                  0 0 160px rgba(59, 130, 246, 0.3),
                  inset 0 0 60px rgba(59, 130, 246, 0.1)
                `
                : '0 0 20px rgba(59, 130, 246, 0.3)',
              transition: 'box-shadow 1s ease-out',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* 内部光效扫描 */}
            {currentStep >= 3 && (
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.3) 50%, transparent 70%)',
                  animation: 'scan 3s linear infinite',
                  transform: 'translateX(-100%)'
                }}
              />
            )}

            {/* 内部渐变光效 */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, transparent 50%, rgba(139, 92, 246, 0.1) 100%)',
                opacity: currentStep >= 3 ? 1 : 0,
                transition: 'opacity 0.8s ease-out'
              }}
            />
            
            {/* F字母 - 蓝色渐变，从浅到深 */}
            <span 
              className="relative font-bold text-8xl md:text-9xl z-10"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.05em',
                fontWeight: 800,
                textShadow: currentStep >= 3 
                  ? '0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.4)'
                  : 'none',
                filter: currentStep >= 3 ? 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))' : 'none',
                transition: 'all 0.8s ease-out',
                animation: currentStep >= 3 ? 'glowPulse 2s ease-in-out infinite' : 'none'
              }}
            >
              F
            </span>

            {/* 边缘光效 */}
            {currentStep >= 3 && (
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.3)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>

          {/* 外部旋转光环 */}
          {currentStep >= 3 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                width: '300px',
                height: '300px',
                animation: 'rotate 10s linear infinite'
              }}
            >
              <div
                className="w-full h-full rounded-full border-2 border-transparent"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                  mask: 'radial-gradient(circle, transparent 45%, black 50%)',
                  WebkitMask: 'radial-gradient(circle, transparent 45%, black 50%)'
                }}
              />
            </div>
          )}
        </div>

        {/* 文字动画 */}
        <div 
          className="text-center"
          style={{
            opacity: currentStep >= 5 ? 1 : 0,
            transform: currentStep >= 5 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <h1 
            className="text-4xl md:text-5xl font-extrabold mb-3"
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              textShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.4))'
            }}
          >
            Follow.ai
          </h1>
          <p 
            className="text-blue-300 text-base md:text-lg font-medium"
            style={{
              textShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
              letterSpacing: '0.05em'
            }}
          >
            {t('intro.tagline') || 'Where AI Tools Show Their Real Work'}
          </p>
        </div>
      </div>

      {/* 跳过按钮 */}
      {canSkip && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-blue-300/70 hover:text-blue-300 text-sm font-medium transition-all duration-300 px-6 py-2.5 rounded-full border border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/10 backdrop-blur-sm"
          style={{
            opacity: canSkip ? 1 : 0,
            animation: 'fadeIn 0.3s ease-out',
            textShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
          }}
        >
          {t('intro.skip') || 'Skip'}
        </button>
      )}

      {/* 加载进度条 */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-950/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300"
          style={{
            width: currentStep >= 6 ? '100%' : `${(currentStep / 6) * 100}%`,
            transition: 'width 0.1s linear',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)'
          }}
        />
      </div>
    </div>
  );
};

export default IntroAnimation;
