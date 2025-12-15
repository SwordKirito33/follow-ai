import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Tooltip from './Tooltip';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative pt-16 pb-20 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Content */}
        <div className="space-y-8 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            {t('hero.title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {t('hero.titleHighlight')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
            {t('hero.subtitle')} {t('hero.joinCount')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1 hover:scale-105 animate-glow">
              {t('hero.startEarning')}
            </Link>
            <Link to="/tasks" className="glass-card border-2 border-white/50 hover:border-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 hover:scale-105 text-center">
              {t('hero.getValidated')}
            </Link>
          </div>

          <div className="flex justify-center lg:justify-start gap-8 pt-4">
            <div className="text-center lg:text-left">
              <strong className="block text-2xl font-bold text-gray-900">3,458</strong>
              <span className="text-sm text-gray-500">{t('hero.stats.reviews')}</span>
            </div>
            <div className="text-center lg:text-left">
              <strong className="block text-2xl font-bold text-gray-900">127</strong>
              <span className="text-sm text-gray-500">{t('hero.stats.tools')}</span>
            </div>
            <div className="text-center lg:text-left">
              <strong className="block text-2xl font-bold text-gray-900">$45,820</strong>
              <span className="text-sm text-gray-500">{t('hero.stats.earned')}</span>
            </div>
          </div>
        </div>
        
        {/* Hero Image / Demo Card */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-full animate-slideUp">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <div className="relative glass-card rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('common.verified')} Output</span>
                <Tooltip content="Work output verified by our community consensus algorithm">
                  <span className="flex items-center text-green-600 text-xs font-bold gap-1 cursor-help">
                    <CheckCircle size={14} /> {t('common.verifiedBy')}
                  </span>
                </Tooltip>
              </div>
              <div className="p-6">
                 <div className="flex items-start gap-4 mb-4">
                   <img src="https://picsum.photos/seed/user1/40/40" className="w-10 h-10 rounded-full" alt="User" />
                   <div>
                     <h3 className="font-bold text-sm">Alex's Review of Cursor</h3>
                     <p className="text-xs text-gray-500">Coding • 2 {t('common.hoursAgo')}</p>
                   </div>
                   <div className="ml-auto bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
                     {t('common.earned')} $50
                   </div>
                 </div>
                 <p className="text-sm text-gray-700 mb-4">
                   "Here is the React component I built in 5 mins..."
                 </p>
                 <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
                   <img src="https://picsum.photos/seed/hero-code/500/300" alt="Code snippet" className="w-full h-48 object-cover opacity-80" />
                 </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;