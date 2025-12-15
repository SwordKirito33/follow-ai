import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';
import { calculateFGridPositions, getRandomSpawnPosition } from './FGrid';
import { hasSeenIntro, markIntroAsSeen, getViewportDimensions } from './utils';
import Card from './Card';
import ScanEffect from './ScanEffect';
import FollowLogo from '../FollowLogo';
import { ANIMATION_TIMINGS, CARD_COUNT } from '../../constants/intro';

type AnimationPhase =
  | 'idle'
  | 'platform-wake'
  | 'cards-enter'
  | 'forming-f'
  | 'verification-scan'
  | 'logo-reveal'
  | 'transition-out'
  | 'complete';

const IntroAnimation: React.FC = () => {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVerified, setCardsVerified] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [logoPosition, setLogoPosition] = useState<'center' | 'navbar'>('center');
  const reducedMotion = useReducedMotion();
  const [viewport, setViewport] = useState(getViewportDimensions());

  // Update viewport on resize
  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewportDimensions());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if should show intro
  useEffect(() => {
    if (hasSeenIntro() || reducedMotion) {
      return;
    }
    setIsVisible(true);
    setPhase('platform-wake');
  }, [reducedMotion]);

  // Animation timeline
  useEffect(() => {
    if (!isVisible || reducedMotion) return;

    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Platform wake-up (0-0.3s)
    timers.push(
      setTimeout(() => {
        setPhase('cards-enter');
      }, ANIMATION_TIMINGS.PLATFORM_WAKE_UP)
    );

    // Phase 2: Cards enter (0.3-0.9s)
    timers.push(
      setTimeout(() => {
        setPhase('forming-f');
      }, ANIMATION_TIMINGS.PLATFORM_WAKE_UP + ANIMATION_TIMINGS.OUTPUT_CARDS_ENTER)
    );

    // Phase 3: Forming F shape (0.9-1.3s)
    timers.push(
      setTimeout(() => {
        setPhase('verification-scan');
        // Start scan animation
        let scanStart = Date.now();
        const scanDuration = ANIMATION_TIMINGS.VERIFICATION_SCAN;
        const scanInterval = setInterval(() => {
          const elapsed = Date.now() - scanStart;
          const progress = Math.min(elapsed / scanDuration, 1);
          setScanProgress(progress);

          // Mark cards as verified when scan passes them
          if (progress > 0.5 && !cardsVerified) {
            setCardsVerified(true);
          }

          if (progress >= 1) {
            clearInterval(scanInterval);
            setPhase('logo-reveal');
            setShowLogo(true);
          }
        }, 16); // ~60fps

        return () => clearInterval(scanInterval);
      }, ANIMATION_TIMINGS.PLATFORM_WAKE_UP +
        ANIMATION_TIMINGS.OUTPUT_CARDS_ENTER +
        ANIMATION_TIMINGS.FORMING_F_SHAPE)
    );

          // Phase 4: Logo reveal (1.3-1.6s)
    timers.push(
      setTimeout(() => {
        // Fade out cards
        setShowCards(false);
        // Get navbar logo position after a brief delay
        setTimeout(() => {
          const navbarLogo = document.querySelector('[data-navbar-logo]') as HTMLElement;
          if (navbarLogo) {
            setLogoPosition('navbar');
          } else {
            // Fallback: just fade out
            setPhase('transition-out');
          }
        }, 100);
      }, ANIMATION_TIMINGS.PLATFORM_WAKE_UP +
        ANIMATION_TIMINGS.OUTPUT_CARDS_ENTER +
        ANIMATION_TIMINGS.FORMING_F_SHAPE +
        ANIMATION_TIMINGS.VERIFICATION_SCAN)
    );

    // Phase 5: Transition out (1.6-1.8s)
    timers.push(
      setTimeout(() => {
        setPhase('transition-out');
      }, ANIMATION_TIMINGS.PLATFORM_WAKE_UP +
        ANIMATION_TIMINGS.OUTPUT_CARDS_ENTER +
        ANIMATION_TIMINGS.FORMING_F_SHAPE +
        ANIMATION_TIMINGS.VERIFICATION_SCAN +
        ANIMATION_TIMINGS.LOGO_REVEAL)
    );

    // Phase 6: Complete
    timers.push(
      setTimeout(() => {
        setPhase('complete');
        setIsVisible(false);
        markIntroAsSeen();
      }, ANIMATION_TIMINGS.TOTAL_DURATION)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isVisible, reducedMotion, cardsVerified]);

  // Handle skip
  const handleSkip = () => {
    setPhase('complete');
    setIsVisible(false);
    markIntroAsSeen();
  };

  // Don't render if not visible or should skip
  if (!isVisible || reducedMotion) {
    return null;
  }

  // Calculate grid positions
  const { width, height } = viewport;
  const isMobile = width < 768;
  const gridPositions = calculateFGridPositions(width, height);

  // Get navbar logo position for final transition
  const navbarLogo = document.querySelector('[data-navbar-logo]') as HTMLElement;
  const navbarRect = navbarLogo?.getBoundingClientRect();

  return (
    <AnimatePresence>
      {isVisible && phase !== 'complete' && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dark navy gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

          {/* Optional noise/grid texture */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Platform wake-up text */}
          {phase === 'platform-wake' && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              Benchmarking AI with real work…
            </motion.div>
          )}

          {/* Cards */}
          {showCards && phase !== 'idle' && phase !== 'platform-wake' && (
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: showCards ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {gridPositions.map((gridPos, index) => {
                const spawn = getRandomSpawnPosition(width, height);
                return (
                  <Card
                    key={index}
                    index={index}
                    isVerified={cardsVerified}
                    spawnX={spawn.x}
                    spawnY={spawn.y}
                    spawnRotation={spawn.rotation}
                    targetX={gridPos.x}
                    targetY={gridPos.y}
                    targetRotation={0}
                    isMobile={isMobile}
                    shouldAnimate={phase !== 'idle' && showCards}
                    scanProgress={scanProgress}
                  />
                );
              })}
            </motion.div>
          )}

          {/* Scan Effect */}
          {phase === 'verification-scan' && (
            <ScanEffect progress={scanProgress} shouldAnimate={true} />
          )}

          {/* Logo Reveal */}
          {showLogo && (
            <motion.div
              className="absolute pointer-events-none"
              initial={{
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                scale: 1,
                opacity: 0,
              }}
              animate={
                logoPosition === 'navbar' && navbarRect
                  ? {
                      top: navbarRect.top + navbarRect.height / 2,
                      left: navbarRect.left + navbarRect.width / 2,
                      x: '-50%',
                      y: '-50%',
                      scale: 0.4,
                      opacity: 1,
                    }
                  : {
                      top: '50%',
                      left: '50%',
                      x: '-50%',
                      y: '-50%',
                      scale: 1,
                      opacity: 1,
                    }
              }
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.4,
                opacity: { duration: 0.2 },
              }}
            >
              <FollowLogo size={120} />
            </motion.div>
          )}

          {/* Skip Button */}
          <motion.button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-50 text-slate-400 hover:text-slate-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Skip intro animation"
            tabIndex={0}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Skip Intro
          </motion.button>

          {/* Fade out overlay */}
          {phase === 'transition-out' && (
            <motion.div
              className="absolute inset-0 bg-slate-950"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;

