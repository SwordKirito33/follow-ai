import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

const VisitTracker: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // 如果已登录，不显示提示
    if (isAuthenticated) return;

    // 检查用户是否已经关闭过提示
    const hasSeenPrompt = localStorage.getItem('hasSeenAuthPrompt');
    if (hasSeenPrompt === 'true') return;

    // 检测用户交互（滚动、点击）
    const handleInteraction = () => {
      setHasInteracted(true);
    };
    
    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('mousemove', handleInteraction, { once: true });

    // 15秒后弹出（如果用户没有交互）
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowPrompt(true);
      }
    }, 15000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
    };
  }, [isAuthenticated, hasInteracted]);

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('hasSeenAuthPrompt', 'true');
  };

  // 如果用户滚动到页面底部，也弹出提示
  useEffect(() => {
    if (isAuthenticated || showPrompt) return;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 滚动到80%时弹出
      if (scrollPosition >= documentHeight * 0.8) {
        const hasSeenPrompt = localStorage.getItem('hasSeenAuthPrompt');
        if (hasSeenPrompt !== 'true') {
          setShowPrompt(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, showPrompt]);

  return (
    <AuthModal
      isOpen={showPrompt}
      onClose={handleClose}
      initialMode="signup"
    />
  );
};

export default VisitTracker;

