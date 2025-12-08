import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xl font-bold text-gray-900 mb-4">
          <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-xs">F</div>
          Follow.ai
        </div>
        <p className="text-gray-500 text-sm mb-6">
          © 2025 Follow.ai. {t('footer.rights')} <br/>
          {t('footer.tagline')}
        </p>
        <div className="flex justify-center gap-6 text-sm text-gray-600">
          <Link to="/about" className="hover:text-blue-600">{t('nav.about')}</Link>
          <Link to="/terms" className="hover:text-blue-600">Terms</Link>
          <a href="mailto:hello@follow.ai" className="hover:text-blue-600">{t('footer.contact')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

