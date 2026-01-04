import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, LogOut, User, Bell, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import LanguageSelector from './LanguageSelector';
import FontSelector from './FontSelector';
import AuthModal from './AuthModal';
import FollowLogo from './FollowLogo';
import FollowButton from './ui/follow-button';
import NotificationCenter from './NotificationCenter';
import Badge from './ui/Badge';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const { data } = await supabase
          .from('app_admins')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle();
        setIsAdmin(!!data);
      } catch (err) {
        console.error('Failed to check admin status:', err);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

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

  const isActive = (path: string) => location.pathname === path ? 'text-primary-cyan font-semibold' : 'text-gray-400 hover:text-white';

  return (
    <nav className="sticky top-0 z-50 glass-nav h-[70px] flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo with wordmark */}
        <Link to="/" className="flex items-center gap-3 group transition-all hover:scale-[1.02]" data-navbar-logo>
          <FollowLogo size={40} showWordmark={true} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          <Link 
            to="/rankings" 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              location.pathname === '/rankings' 
                ? 'text-primary-cyan bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800'
            }`}
          >
            {t('nav.browseTools')}
          </Link>
          <Link 
            to="/tasks" 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              location.pathname === '/tasks' 
                ? 'text-primary-cyan bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800'
            }`}
          >
            {t('nav.earnMoney')}
          </Link>
          <Link 
            to="/leaderboard" 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              location.pathname === '/leaderboard' 
                ? 'text-primary-cyan bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800'
            }`}
          >
            Leaderboard
          </Link>
          {isAuthenticated && (
            <Link 
              to="/xp-history" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname === '/xp-history' 
                  ? 'text-primary-cyan bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800'
              }`}
            >
              XP History
            </Link>
          )}
          {isAuthenticated && (
            <Link 
              to="/wallet" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname === '/wallet' 
                  ? 'text-primary-cyan bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800'
              }`}
            >
              Wallet
            </Link>
          )}
          <Link 
            to="/hire" 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              location.pathname === '/hire' 
                ? 'text-primary-cyan bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800'
            }`}
          >
            Hire
          </Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <FontSelector />
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-gray-300 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800 transition-colors"
                title="Notifications"
              >
                <Bell size={20} />
                <Badge
                  variant="danger"
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] px-1"
                >
                  3
                </Badge>
              </button>
              <FollowButton 
                to="/submit"
                as="link"
                variant="primary"
                size="md"
              >
                Submit output
              </FollowButton>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800 transition-colors"
              >
                <User size={18} />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800 transition-colors"
              >
                <User size={18} />
                <span className="hidden lg:inline">{t('nav.profile')}</span>
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin/xp" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800 transition-colors"
                >
                  <Shield size={18} />
                  <span className="hidden lg:inline">Admin XP</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <FollowButton
                onClick={handleLoginClick}
                variant="ghost"
                size="md"
              >
                Log in
              </FollowButton>
              <FollowButton
                onClick={handleSignupClick}
                variant="primary"
                size="md"
              >
                Sign up
              </FollowButton>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-400" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white border-b border-white/10 shadow-lg md:hidden flex flex-col p-4 gap-4">
          <Link to="/" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.browseTools')}</Link>
          <Link to="/tasks" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.earnMoney')}</Link>
          <Link to="/payments" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.payments')}</Link>
          <Link to="/rankings" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.rankings')}</Link>
          <Link to="/news" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.aiNews')}</Link>
          <Link to="/about" onClick={toggleMobileMenu} className="text-lg font-medium">{t('nav.about')}</Link>
          {isAuthenticated && (
            <Link to="/wallet" onClick={toggleMobileMenu} className="text-lg font-medium">Wallet</Link>
          )}
          <div className="flex items-center justify-between">
            <LanguageSelector />
          </div>
          {isAuthenticated ? (
            <>
              <FollowButton
                to="/submit"
                as="link"
                variant="primary"
                size="md"
                className="w-full"
                onClick={toggleMobileMenu}
              >
                Submit output
              </FollowButton>
              <FollowButton
                to="/profile"
                as="link"
                variant="secondary"
                size="md"
                className="w-full"
                onClick={toggleMobileMenu}
              >
                View profile
              </FollowButton>
              <FollowButton
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                variant="destructive"
                size="md"
                icon={LogOut}
                className="w-full"
              >
                Log out
              </FollowButton>
            </>
          ) : (
            <>
              <FollowButton
                onClick={() => {
                  handleLoginClick();
                  toggleMobileMenu();
                }}
                variant="ghost"
                size="md"
                className="w-full"
              >
                Log in
              </FollowButton>
              <FollowButton
                onClick={() => {
                  handleSignupClick();
                  toggleMobileMenu();
                }}
                variant="primary"
                size="md"
                className="w-full"
              >
                Sign up
              </FollowButton>
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
      
      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </nav>
  );
};

export default Navbar;