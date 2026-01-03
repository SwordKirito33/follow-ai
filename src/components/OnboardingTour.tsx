import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface OnboardingTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  isOpen,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Find and highlight target element
  useEffect(() => {
    if (step?.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setTargetRect(null);
    }
  }, [step]);

  const handleNext = useCallback(() => {
    if (step?.action) {
      step.action();
    }
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [step, isLastStep, onComplete]);

  const handlePrev = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    },
    [handleNext, handlePrev, onSkip]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 20;
    const tooltipWidth = 400;
    const tooltipHeight = 200;

    switch (step?.position || 'bottom') {
      case 'top':
        return {
          top: targetRect.top - tooltipHeight - padding,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
      case 'bottom':
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.left - tooltipWidth - padding,
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.right + padding,
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay with spotlight */}
      <div className="absolute inset-0 bg-black/60">
        {targetRect && (
          <div
            className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-lg"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={getTooltipPosition()}
          className="absolute w-[400px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <button
                onClick={onSkip}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {step?.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {step?.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="px-6 pb-4 flex justify-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-blue-600'
                    : index < currentStep
                    ? 'bg-blue-300'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium"
            >
              Skip tour
            </button>
            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium flex items-center gap-1 hover:shadow-lg transition-all"
              >
                {isLastStep ? (
                  <>
                    <Check className="w-4 h-4" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Hook to manage onboarding state
export const useOnboarding = (tourId: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(`onboarding-${tourId}-completed`);
    if (completed) {
      setHasCompleted(true);
    }
  }, [tourId]);

  const startTour = useCallback(() => {
    setIsOpen(true);
  }, []);

  const completeTour = useCallback(() => {
    setIsOpen(false);
    setHasCompleted(true);
    localStorage.setItem(`onboarding-${tourId}-completed`, 'true');
  }, [tourId]);

  const skipTour = useCallback(() => {
    setIsOpen(false);
    setHasCompleted(true);
    localStorage.setItem(`onboarding-${tourId}-completed`, 'true');
  }, [tourId]);

  const resetTour = useCallback(() => {
    setHasCompleted(false);
    localStorage.removeItem(`onboarding-${tourId}-completed`);
  }, [tourId]);

  return {
    isOpen,
    hasCompleted,
    startTour,
    completeTour,
    skipTour,
    resetTour,
  };
};

// Default tour steps for Follow.ai
export const defaultTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Follow.ai! 👋',
    description:
      'Follow.ai is a platform where you can test AI tools, earn XP, and compete with other testers. Let us show you around!',
  },
  {
    id: 'browse-tools',
    title: 'Browse AI Tools',
    description:
      'Discover and explore various AI tools available for testing. Each tool has detailed information and testing tasks.',
    target: '[data-tour="browse-tools"]',
    position: 'bottom',
  },
  {
    id: 'earn-money',
    title: 'Complete Tasks & Earn XP',
    description:
      'Complete testing tasks to earn XP points. The more tasks you complete, the higher you climb on the leaderboard!',
    target: '[data-tour="earn-money"]',
    position: 'bottom',
  },
  {
    id: 'leaderboard',
    title: 'Compete on the Leaderboard',
    description:
      'See how you rank against other testers. Top performers get special rewards and recognition!',
    target: '[data-tour="leaderboard"]',
    position: 'bottom',
  },
  {
    id: 'wallet',
    title: 'Manage Your Wallet',
    description:
      'Track your XP balance, purchase XP packages, and view your transaction history in the wallet.',
    target: '[data-tour="wallet"]',
    position: 'bottom',
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description:
      'View your achievements, badges, and progress. Customize your profile and track your testing journey!',
    target: '[data-tour="profile"]',
    position: 'left',
  },
  {
    id: 'complete',
    title: "You're All Set! 🎉",
    description:
      "You're ready to start testing AI tools and earning XP. Good luck on your journey to the top of the leaderboard!",
  },
];

export default OnboardingTour;
