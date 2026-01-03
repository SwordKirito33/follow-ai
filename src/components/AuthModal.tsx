import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FollowButton from './ui/follow-button';
import SocialLogin from './SocialLogin';
import PasswordStrength from './PasswordStrength';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, signup } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setName('');
      setUsername('');
      setError('');
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          setError(t('auth.fillAllFields'));
          setIsSubmitting(false);
          return;
        }
        await login(email, password);
        // Wait a bit for auth state to update before closing
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        if (!email || !password || !name || !username) {
          setError(t('auth.fillAllFields'));
          setIsSubmitting(false);
          return;
        }
        if (username.length < 3 || username.length > 20) {
          setError(t('auth.usernameLength') || 'Username must be between 3 and 20 characters');
          setIsSubmitting(false);
          return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          setError(t('auth.usernameInvalid') || 'Username can only contain letters, numbers, and underscores');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError(t('auth.passwordTooShort'));
          setIsSubmitting(false);
          return;
        }
        await signup(email, password, name, username);
        // Wait a bit for auth state to update before closing
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || t('auth.errorOccurred'));
      setIsSubmitting(false);
    }
  };

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        // 点击背景关闭
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-slideUp relative z-10 my-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {mode === 'login' ? t('auth.login') : t('auth.signup')}
          </h2>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            {mode === 'login' ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.username') || 'Username'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder={t('auth.usernamePlaceholder') || 'username (3-20 characters)'}
                    minLength={3}
                    maxLength={20}
                    pattern="[a-zA-Z0-9_]+"
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('auth.usernameHint') || 'Only letters, numbers, and underscores'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder={t('auth.namePlaceholder')}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder={t('auth.emailPlaceholder')}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder={t('auth.passwordPlaceholder')}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {mode === 'signup' && (
              <>
                <p className="text-xs text-gray-500 mt-1">{t('auth.passwordHint')}</p>
                <PasswordStrength password={password} showRequirements={password.length > 0} />
              </>
            )}
          </div>

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  // Dispatch event to open forgot password modal
                  window.dispatchEvent(new CustomEvent('open-forgot-password'));
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {t('auth.forgotPassword') || 'Forgot password?'}
              </button>
            </div>
          )}

          <FollowButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            className="w-full"
          >
            {mode === 'login' ? 'Log in' : 'Sign up'}
          </FollowButton>

          {/* Social Login */}
          <div className="mt-6">
            <SocialLogin onSuccess={onClose} />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                {t('auth.noAccount')}{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  {t('auth.signup')}
                </button>
              </>
            ) : (
              <>
                {t('auth.haveAccount')}{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  {t('auth.login')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

