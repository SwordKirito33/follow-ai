import React from 'react';
import { Zap, Upload, CheckCircle, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './ui/Button';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  
  const steps = [
    {
      icon: Zap,
      title: 'Pick a task & an AI tool',
      description: 'Choose from hundreds of testing tasks or select any AI tool you want to benchmark.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Upload,
      title: 'Run your prompt and capture the output',
      description: 'Use the AI tool with a real prompt, then capture and save the actual output you received.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: CheckCircle,
      title: 'Submit it to Follow.ai',
      description: 'Upload your prompt and output. Our AI analyzes quality, and our team verifies authenticity.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: DollarSign,
      title: 'Get verified, earn rewards',
      description: 'Once verified, you earn rewards and help build the most trusted AI tool benchmark.',
      color: 'from-amber-500 to-orange-500'
    }
  ];
  
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/10 to-white"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Earn money by testing AI tools. It's that simple.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center font-black text-lg shadow-lg z-10">
                  {index + 1}
                </div>
                
                {/* Card */}
                <div className="glass-card rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Button
            to="/submit"
            as="link"
            variant="primary"
            size="lg"
          >
            Start earning with your AI outputs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

