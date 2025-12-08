import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isActive = (path: string) => location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 h-[70px] flex items-center shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
            F
          </div>
          Follow.ai
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={isActive('/')}>{t('nav.browseTools')}</Link>
          <Link to="/tasks" className={isActive('/tasks')}>
            <span className="flex items-center gap-1">
              {t('nav.earnMoney')}
            </span>
          </Link>
          <Link to="/payments" className={isActive('/payments')}>{t('nav.payments')}</Link>
          <Link to="/rankings" className={isActive('/rankings')}>{t('nav.rankings')}</Link>
          <Link to="/news" className={isActive('/news')}>{t('nav.aiNews')}</Link>
          <Link to="/about" className={isActive('/about')}>{t('nav.about')}</Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSelector />
          <Link to="/submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
            {t('nav.submitReview')}
          </Link>
          <Link to="/profile" className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-2.5 rounded-lg font-medium transition-colors">
            {t('nav.profile')}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white border-b border-gray-200 shadow-lg md:hidden flex flex-col p-4 gap-4">
          <Link to="/" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.browseTools')}</Link>
          <Link to="/tasks" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.earnMoney')}</Link>
          <Link to="/payments" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.payments')}</Link>
          <Link to="/rankings" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.rankings')}</Link>
          <Link to="/news" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.aiNews')}</Link>
          <Link to="/about" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.about')}</Link>
          <div className="flex items-center justify-between">
            <LanguageSelector />
          </div>
          <Link to="/submit" onClick={toggleMobileMenu} className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium">{t('nav.submitReview')}</Link>
          <Link to="/profile" onClick={toggleMobileMenu} className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg text-center font-medium">{t('nav.profile')}</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;