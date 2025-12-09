import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, LogOut, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import AuthModal from './AuthModal';

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
        {/* Logo - 使用你的logo设计风格 */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 group transition-transform hover:scale-105">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-2xl group-hover:shadow-blue-500/50 transition-all relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1e 100%)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.1)'
            }}
          >
            {/* 内部光效 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/10" />
            {/* F字母 - 蓝色渐变 */}
            <span 
              className="relative z-10"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))',
                letterSpacing: '-0.05em'
              }}
            >
              F
            </span>
          </div>
          <span className="gradient-text font-extrabold">Follow.ai</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`${isActive('/')} transition-all hover:scale-105 relative group`}>
            {t('nav.browseTools')}
            {location.pathname === '/' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></span>}
          </Link>
          <Link to="/tasks" className={`${isActive('/tasks')} transition-all hover:scale-105 relative group`}>
            <span className="flex items-center gap-1">
              {t('nav.earnMoney')}
            </span>
            {location.pathname === '/tasks' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></span>}
          </Link>
          <Link to="/payments" className={`${isActive('/payments')} transition-all hover:scale-105 relative group`}>
            {t('nav.payments')}
            {location.pathname === '/payments' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></span>}
          </Link>
          <Link to="/rankings" className={`${isActive('/rankings')} transition-all hover:scale-105 relative group`}>
            {t('nav.rankings')}
            {location.pathname === '/rankings' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></span>}
          </Link>
          <Link to="/news" className={`${isActive('/news')} transition-all hover:scale-105 relative group`}>
            {t('nav.aiNews')}
            {location.pathname === '/news' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></span>}
          </Link>
          <Link to="/about" className={`${isActive('/about')} transition-all hover:scale-105 relative group`}>
            {t('nav.about')}
            {location.pathname === '/about' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></span>}
          </Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <Link to="/submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                {t('nav.submitReview')}
              </Link>
              <Link to="/profile" className="glass-card hover:bg-white/90 text-gray-900 px-5 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2">
                <User size={18} />
                {user?.name || t('nav.profile')}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <LogOut size={18} />
                {t('auth.logout')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="text-gray-600 hover:text-gray-900 px-4 py-2.5 font-medium transition-colors"
              >
                {t('auth.login')}
              </button>
              <button
                onClick={handleSignupClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('auth.signup')}
              </button>
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