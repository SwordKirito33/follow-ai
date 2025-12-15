import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, LogOut, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import AuthModal from './AuthModal';
import FollowLogo from './FollowLogo';
import Button from './ui/Button';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const location = useLocation();
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };
  
  const handleSignupClick = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };
  
  const handleLogout = () => {
    if (window.confirm(t('auth.logoutConfirm'))) {
      logout();
    }
  };

  const isActive = (path: string) => location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900';

  return (
    <nav className="sticky top-0 z-50 glass-nav h-[70px] flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo with wordmark */}
        <Link to="/" className="flex items-center gap-3 group transition-all hover:scale-[1.02]">
          <FollowLogo size={40} showWordmark={true} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          <Link 
            to="/rankings" 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              location.pathname === '/rankings' 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('nav.browseTools')}
          </Link>
          <Link 
            to="/tasks" 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              location.pathname === '/tasks' 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('nav.earnMoney')}
          </Link>
          <Link 
            to="/leaderboard" 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              location.pathname === '/leaderboard' 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Leaderboard
          </Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <Button 
                to="/submit"
                as="link"
                variant="primary"
                size="md"
              >
                {t('nav.submitReview')}
              </Button>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User size={18} />
                <span className="hidden lg:inline">{user?.name || t('nav.profile')}</span>
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {t('auth.login')}
              </button>
              <Button
                onClick={handleSignupClick}
                variant="primary"
                size="md"
              >
                {t('auth.signup')}
              </Button>
            </>
          )}
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
          {isAuthenticated ? (
            <>
              <Link to="/submit" onClick={toggleMobileMenu} className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium">{t('nav.submitReview')}</Link>
              <Link to="/profile" onClick={toggleMobileMenu} className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg text-center font-medium">{t('nav.profile')}</Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-center font-medium flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                {t('auth.logout')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  handleLoginClick();
                  toggleMobileMenu();
                }}
                className="text-gray-900 px-4 py-3 rounded-lg text-center font-medium"
              >
                {t('auth.login')}
              </button>
              <button
                onClick={() => {
                  handleSignupClick();
                  toggleMobileMenu();
                }}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium"
              >
                {t('auth.signup')}
              </button>
            </>
          )}
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </nav>
  );
};

export default Navbar;