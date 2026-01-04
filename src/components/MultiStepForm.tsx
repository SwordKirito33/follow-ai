import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';

interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  isValid?: boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ steps, onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];
  const canProceed = currentStepData.isValid !== false;

  const handleNext = () => {
    if (canProceed && !isLastStep) {
      setCompletedSteps(new Set([...completedSteps, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (canProceed) {
      setCompletedSteps(new Set([...completedSteps, currentStep]));
      onSubmit(formData);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    index < currentStep
                      ? 'bg-green-600 text-white'
                      : index === currentStep
                      ? 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white ring-4 ring-blue-200 dark:ring-blue-900'
                      : 'bg-white/10 dark:bg-gray-700 text-gray-400 dark:text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <Check size={20} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs mt-2 text-center font-medium ${
                  index === currentStep
                    ? 'text-primary-cyan dark:text-blue-400 font-semibold'
                    : index < currentStep
                    ? 'text-accent-green dark:text-green-400'
                    : 'text-gray-400 dark:text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    index < currentStep
                      ? 'bg-green-600'
                      : 'bg-white/10 dark:bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="glass-card rounded-xl p-8 min-h-[400px]">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white dark:text-white mb-2 tracking-tight">
            {currentStepData.title}
          </h2>
          {currentStepData.description && (
            <p className="text-gray-400 dark:text-gray-400">
              {currentStepData.description}
            </p>
          )}
        </div>

        <div className="mb-8">
          {React.cloneElement(currentStepData.component as React.ReactElement, {
            formData,
            updateFormData,
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 dark:border-gray-700">
          <div>
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="ghost"
                size="md"
              >
                Cancel
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {!isFirstStep && (
              <Button
                onClick={handlePrevious}
                variant="secondary"
                size="md"
              >
                <ChevronLeft size={18} className="mr-2" />
                Previous
              </Button>
            )}
            {!isLastStep ? (
              <Button
                onClick={handleNext}
                variant="primary"
                size="md"
                disabled={!canProceed}
              >
                Next
                <ChevronRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="primary"
                size="md"
                disabled={!canProceed}
              >
                Submit Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;

