// Animation Components for Follow-ai
// Reusable animation wrappers and effects

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

// ============================================
// Fade In Animation
// ============================================

export function FadeIn({ children, className, delay = 0, duration = 300 }: AnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

// ============================================
// Slide In Animation
// ============================================

type SlideDirection = 'left' | 'right' | 'up' | 'down';

interface SlideInProps extends AnimationProps {
  direction?: SlideDirection;
}

export function SlideIn({ children, className, delay = 0, duration = 300, direction = 'up' }: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    switch (direction) {
      case 'left': return 'translate(-50px, 0)';
      case 'right': return 'translate(50px, 0)';
      case 'up': return 'translate(0, 50px)';
      case 'down': return 'translate(0, -50px)';
    }
  };

  return (
    <div
      ref={ref}
      className={cn('transition-all', className)}
      style={{
        transitionDuration: `${duration}ms`,
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
      }}
    >
      {children}
    </div>
  );
}

// ============================================
// Scale In Animation
// ============================================

export function ScaleIn({ children, className, delay = 0, duration = 300 }: AnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn('transition-all', className)}
      style={{
        transitionDuration: `${duration}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.9)',
      }}
    >
      {children}
    </div>
  );
}

// ============================================
// Stagger Children Animation
// ============================================

interface StaggerProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  duration?: number;
}

export function Stagger({ children, className, staggerDelay = 100, duration = 300 }: StaggerProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * staggerDelay} duration={duration}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

// ============================================
// Pulse Animation
// ============================================

interface PulseProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export function Pulse({ children, className, active = true }: PulseProps) {
  return (
    <div className={cn(active && 'animate-pulse', className)}>
      {children}
    </div>
  );
}

// ============================================
// Bounce Animation
// ============================================

export function Bounce({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('animate-bounce', className)}>
      {children}
    </div>
  );
}

// ============================================
// Spin Animation
// ============================================

export function Spin({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('animate-spin', className)}>
      {children}
    </div>
  );
}

// ============================================
// Shake Animation
// ============================================

export function Shake({ children, className, active = false }: { children: React.ReactNode; className?: string; active?: boolean }) {
  return (
    <div
      className={cn(className)}
      style={{
        animation: active ? 'shake 0.5s ease-in-out' : 'none',
      }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
      {children}
    </div>
  );
}

// ============================================
// Typewriter Effect
// ============================================

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
}

export function Typewriter({ text, className, speed = 50, onComplete }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// ============================================
// Counter Animation
// ============================================

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export function Counter({ from = 0, to, duration = 2000, className, formatter }: CounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(from + (to - from) * easeOutQuart);
            setCount(currentValue);
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {formatter ? formatter(count) : count.toLocaleString()}
    </span>
  );
}

// ============================================
// Parallax Effect
// ============================================

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function Parallax({ children, className, speed = 0.5 }: ParallaxProps) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        const elementTop = rect.top + scrolled;
        const relativeScroll = scrolled - elementTop;
        setOffset(relativeScroll * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <div style={{ transform: `translateY(${offset}px)` }}>
        {children}
      </div>
    </div>
  );
}

// ============================================
// Hover Scale Effect
// ============================================

interface HoverScaleProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function HoverScale({ children, className, scale = 1.05 }: HoverScaleProps) {
  return (
    <div
      className={cn('transition-transform duration-200', className)}
      style={{
        ['--hover-scale' as string]: scale,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `scale(${scale})`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
    >
      {children}
    </div>
  );
}

// ============================================
// Ripple Effect
// ============================================

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export function Ripple({ children, className, color = 'rgba(255, 255, 255, 0.3)' }: RippleProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const nextId = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = nextId.current++;

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onClick={handleClick}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// Skeleton Loading
// ============================================

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
}

export function Skeleton({ className, variant = 'rectangular', width, height }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-800/10 dark:bg-gray-700';
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
    />
  );
}

// ============================================
// Confetti Effect
// ============================================

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 500,
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [active, duration]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animation: `confetti-fall ${duration}ms ease-out forwards`,
            animationDelay: `${particle.delay}ms`,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// Export All
// ============================================

export default {
  FadeIn,
  SlideIn,
  ScaleIn,
  Stagger,
  Pulse,
  Bounce,
  Spin,
  Shake,
  Typewriter,
  Counter,
  Parallax,
  HoverScale,
  Ripple,
  Skeleton,
  Confetti,
};
