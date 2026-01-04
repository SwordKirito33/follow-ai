import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, User, Briefcase, FileText, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import FollowButton from '@/components/ui/follow-button';
import { OnboardingStep } from '@/types/progression';
import { getXpReward } from '@/lib/xp-system';
import { trackEvent } from '@/lib/analytics';

const Onboarding: React.FC = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Set your display name & avatar',
      description: 'Let others know who you are',
      completed: completedSteps.has('profile'),
      xpReward: 25,
      route: '/profile?onboarding=true',
    },
    {
      id: 'skills',
      title: 'Tell us what you can do',
      description: 'Add your skills and AI tools you use',
      completed: completedSteps.has('skills'),
      xpReward: 25,
      route: '/profile?onboarding=true&tab=skills',
    },
    {
      id: 'portfolio',
      title: 'Add a sample of your work',
      description: 'Showcase your best AI-generated work',
      completed: completedSteps.has('portfolio'),
      xpReward: 50,
      route: '/profile?onboarding=true&tab=portfolio',
    },
    {
      id: 'first-output',
      title: 'Submit your first output',
      description: 'Get started by submitting an AI tool output',
      completed: completedSteps.has('first-output'),
      xpReward: 50,
      route: '/submit?onboarding=true',
    },
  ];

  const progress = (completedSteps.size / steps.length) * 100;

  const handleStepComplete = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step || completedSteps.has(stepId)) return;

    setCompletedSteps((prev) => new Set([...prev, stepId]));
    
    // Award XP
    const xpReward = getXpReward('onboarding_step');
    toast.success(`+${xpReward} XP`, `Completed: ${step.title}`);
    trackEvent('onboarding_step_completed', { stepId, xpReward });

    // Move to next step
    const currentIndex = steps.findIndex((s) => s.id === stepId);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    if (window.confirm('Skip onboarding? You can complete it later from your profile.')) {
      navigate('/');
      trackEvent('onboarding_completed', { completed: false, stepsCompleted: completedSteps.size });
    }
  };

  const handleFinish = () => {
    if (completedSteps.size === steps.length) {
      const xpReward = getXpReward('onboarding_complete');
      toast.success(`+${xpReward} XP`, 'Onboarding complete!');
      trackEvent('onboarding_completed', { completed: true, stepsCompleted: completedSteps.size });
    }
    navigate('/');
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-black text-white">Welcome to Follow-ai!</h1>
            <span className="text-sm font-semibold text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-blue to-primary-purple transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="glass-card rounded-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-blue/20 flex items-center justify-center">
              {currentStepData.completed ? (
                <CheckCircle className="text-primary-cyan" size={24} />
              ) : (
                <span className="text-primary-cyan font-bold text-lg">{currentStep + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{currentStepData.title}</h2>
              <p className="text-gray-400 mb-4">{currentStepData.description}</p>
              <div className="flex items-center gap-2 text-sm text-primary-cyan font-semibold">
                <Sparkles size={16} />
                <span>Complete to earn +{currentStepData.xpReward} XP</span>
              </div>
            </div>
          </div>

          {/* Step Actions */}
          <div className="flex items-center gap-4">
            <FollowButton
              to={currentStepData.route}
              as="link"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => {
                // Mark as completed when user navigates
                setTimeout(() => {
                  handleStepComplete(currentStepData.id);
                }, 1000);
              }}
            >
              {currentStepData.completed ? 'Update' : 'Get started'}
            </FollowButton>
            {currentStepData.completed && (
              <div className="flex items-center gap-2 text-accent-green">
                <CheckCircle size={20} />
                <span className="font-semibold">Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3 mb-8">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(step.id);
            const isPast = index < currentStep;

            return (
              <div
                key={step.id}
                className={`glass-card rounded-xl p-4 transition-all ${
                  isActive ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-accent-green/20'
                        : isActive
                        ? 'bg-primary-blue/20'
                        : 'bg-white/10'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="text-accent-green" size={20} />
                    ) : (
                      <span
                        className={`font-bold ${
                          isActive ? 'text-primary-cyan' : 'text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles size={14} className="text-blue-500" />
                    <span className="font-semibold text-primary-cyan">+{step.xpReward} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <FollowButton
            onClick={handleSkip}
            variant="ghost"
            size="md"
          >
            Skip for now
          </FollowButton>
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <FollowButton
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="secondary"
                size="md"
                icon={ArrowLeft}
              >
                Previous
              </FollowButton>
            )}
            {currentStep < steps.length - 1 ? (
              <FollowButton
                onClick={() => setCurrentStep(currentStep + 1)}
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
              >
                Next
              </FollowButton>
            ) : (
              <FollowButton
                onClick={handleFinish}
                variant="primary"
                size="md"
                icon={CheckCircle}
                iconPosition="right"
              >
                Finish
              </FollowButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

