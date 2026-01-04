import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Tooltip from './Tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import FollowButton from './ui/follow-button';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative pt-16 pb-20 px-4 overflow-hidden">
      {/* 新设计：深色背景 + 动态光效 */}
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-cyan/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-blue/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Content */}
        <div className="space-y-10 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Where AI tools prove themselves <br />
            <span className="gradient-text">
              with real work
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Follow.ai is the benchmark platform for AI tools. Users submit real prompts and outputs, we verify and score them, and you earn money for high-quality results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <FollowButton
              to="/submit"
              as="link"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
            >
              Start earning
            </FollowButton>
            <FollowButton
              to="/tasks"
              as="link"
              variant="secondary"
              size="lg"
            >
              Browse tools
            </FollowButton>
          </div>

          <div className="flex justify-center lg:justify-start gap-8 sm:gap-12 pt-6">
            <div className="text-center lg:text-left">
              <strong className="block text-3xl sm:text-4xl font-black text-white mb-1">3,458</strong>
              <span className="text-sm font-medium text-gray-400">{t('hero.stats.reviews')}</span>
            </div>
            <div className="text-center lg:text-left">
              <strong className="block text-3xl sm:text-4xl font-black text-white mb-1">127</strong>
              <span className="text-sm font-medium text-gray-400">{t('hero.stats.tools')}</span>
            </div>
            <div className="text-center lg:text-left">
              <strong className="block text-3xl sm:text-4xl font-black gradient-text mb-1">$45,820</strong>
              <span className="text-sm font-medium text-gray-400">{t('hero.stats.earned')}</span>
            </div>
          </div>
        </div>
        
        {/* Hero Image / Demo Card */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-full animate-slideUp">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-cyan via-primary-blue to-primary-purple rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <div className="relative glass-card rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <div className="bg-dark-card/50 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('common.verified')} Output</span>
                <Tooltip content="Work output verified by our community consensus algorithm">
                  <span className="flex items-center text-accent-green text-xs font-bold gap-1 cursor-help">
                    <CheckCircle size={14} /> {t('common.verifiedBy')}
                  </span>
                </Tooltip>
              </div>
              <div className="p-6">
                 <div className="flex items-start gap-4 mb-4">
                   <img loading="lazy" src="https://picsum.photos/seed/user1/40/40" className="w-10 h-10 rounded-full" alt="User" />
                   <div>
                     <h3 className="font-bold text-sm">Alex's Review of Cursor</h3>
                     <p className="text-xs text-gray-400">Coding • 2 {t('common.hoursAgo')}</p>
                   </div>
                   <div className="ml-auto bg-green-900/50 text-green-400 px-2 py-1 rounded text-xs font-bold">
                     {t('common.earned')} $50
                   </div>
                 </div>
                 <p className="text-sm text-gray-300 mb-4">
                   "Here is the React component I built in 5 mins..."
                 </p>
                 <div className="rounded-lg overflow-hidden border border-white/10 bg-gray-900">
                   <img loading="lazy" src="https://picsum.photos/seed/hero-code/500/300" alt="Code snippet" className="w-full h-48 object-cover opacity-80" />
                 </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;