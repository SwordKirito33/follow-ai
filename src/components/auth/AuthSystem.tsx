// Auth System Component for Follow-ai
// Comprehensive authentication with login, register, and password reset

import React, { useState, useCallback } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

type AuthMode = 'login' | 'register' | 'forgot_password' | 'reset_password';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  username?: string;
  displayName?: string;
  agreeTerms?: boolean;
}

interface AuthSystemProps {
  mode?: AuthMode;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (data: AuthFormData) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  onResetPassword: (password: string, token: string) => Promise<void>;
  onSocialLogin?: (provider: 'google' | 'github' | 'twitter') => Promise<void>;
  resetToken?: string;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

// ============================================
// Password Strength Component
// ============================================

function PasswordStrength({ password }: { password: string }) {
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score, label: '弱', color: 'red' };
    if (score <= 2) return { score, label: '一般', color: 'orange' };
    if (score <= 3) return { score, label: '中等', color: 'yellow' };
    if (score <= 4) return { score, label: '强', color: 'green' };
    return { score, label: '非常强', color: 'emerald' };
  };

  const strength = getStrength(password);
  const colorClasses: Record<string, string> = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i <= strength.score ? colorClasses[strength.color] : 'bg-gray-800/10 dark:bg-gray-700'
            )}
          />
        ))}
      </div>
      <p className={cn('text-xs', `text-${strength.color}-500`)}>
        密码强度: {strength.label}
      </p>
    </div>
  );
}

// ============================================
// Social Login Buttons
// ============================================

function SocialLoginButtons({ onSocialLogin, isLoading }: { onSocialLogin?: (provider: 'google' | 'github' | 'twitter') => Promise<void>; isLoading?: boolean }) {
  if (!onSocialLogin) return null;

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-800/50 dark:bg-gray-800 text-gray-400 dark:text-gray-300">
            或使用以下方式
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onSocialLogin('google')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-white/10 dark:border-gray-700 bg-slate-800/50 dark:bg-gray-800 hover:bg-gray-800/5 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-sm font-medium text-gray-300 dark:text-gray-300 hidden sm:inline">Google</span>
        </button>

        <button
          onClick={() => onSocialLogin('github')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-white/10 dark:border-gray-700 bg-slate-800/50 dark:bg-gray-800 hover:bg-gray-800/5 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-300 dark:text-gray-300 hidden sm:inline">GitHub</span>
        </button>

        <button
          onClick={() => onSocialLogin('twitter')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-white/10 dark:border-gray-700 bg-slate-800/50 dark:bg-gray-800 hover:bg-gray-800/5 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
          <span className="text-sm font-medium text-gray-300 dark:text-gray-300 hidden sm:inline">Twitter</span>
        </button>
      </div>
    </div>
  );
}

// ============================================
// Auth System Component
// ============================================

export function AuthSystem({
  mode: initialMode = 'login',
  onLogin,
  onRegister,
  onForgotPassword,
  onResetPassword,
  onSocialLogin,
  resetToken,
  isLoading = false,
  error,
  className,
}: AuthSystemProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    displayName: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setLocalError(null);
  }, []);

  const validateForm = (): boolean => {
    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        setLocalError('请填写邮箱和密码');
        return false;
      }
    }

    if (mode === 'register') {
      if (!formData.email || !formData.password || !formData.username) {
        setLocalError('请填写所有必填字段');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('两次输入的密码不一致');
        return false;
      }
      if (formData.password.length < 8) {
        setLocalError('密码长度至少为8位');
        return false;
      }
      if (!formData.agreeTerms) {
        setLocalError('请同意服务条款和隐私政策');
        return false;
      }
    }

    if (mode === 'forgot_password') {
      if (!formData.email) {
        setLocalError('请输入邮箱地址');
        return false;
      }
    }

    if (mode === 'reset_password') {
      if (!formData.password || !formData.confirmPassword) {
        setLocalError('请输入新密码');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('两次输入的密码不一致');
        return false;
      }
      if (formData.password.length < 8) {
        setLocalError('密码长度至少为8位');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLocalError(null);
    setSuccessMessage(null);

    try {
      switch (mode) {
        case 'login':
          await onLogin(formData.email, formData.password);
          break;
        case 'register':
          await onRegister(formData);
          break;
        case 'forgot_password':
          await onForgotPassword(formData.email);
          setSuccessMessage('重置密码链接已发送到您的邮箱');
          break;
        case 'reset_password':
          if (resetToken) {
            await onResetPassword(formData.password, resetToken);
            setSuccessMessage('密码重置成功，请登录');
            setMode('login');
          }
          break;
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : '操作失败，请重试');
    }
  };

  const displayError = error || localError;

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-slate-800/50 dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mode === 'login' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />}
              {mode === 'register' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />}
              {(mode === 'forgot_password' || mode === 'reset_password') && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />}
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white dark:text-white">
            {mode === 'login' && '欢迎回来'}
            {mode === 'register' && '创建账户'}
            {mode === 'forgot_password' && '忘记密码'}
            {mode === 'reset_password' && '重置密码'}
          </h1>
          <p className="text-gray-400 dark:text-gray-300 mt-2">
            {mode === 'login' && '登录您的 Follow-ai 账户'}
            {mode === 'register' && '加入 Follow-ai 社区'}
            {mode === 'forgot_password' && '输入邮箱以重置密码'}
            {mode === 'reset_password' && '设置您的新密码'}
          </p>
        </div>

        {/* Error/Success Messages */}
        {displayError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{displayError}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="text-sm text-accent-green dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                用户名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="your_username"
                className="w-full px-4 py-2.5 rounded-lg border border-white/10 dark:border-gray-700 bg-slate-800/50 dark:bg-gray-900 text-white dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Display Name (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                显示名称
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="您的昵称"
                className="w-full px-4 py-2.5 rounded-lg border border-white/10 dark:border-gray-700 bg-slate-800/50 dark:bg-gray-900 text-white dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Email */}
          {mode !== 'reset_password' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-white/10 dark:border-gray-700 bg-slate-800/50 dark:bg-gray-900 text-white dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Password */}
          {mode !== 'forgot_password' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                {mode === 'reset_password' ? '新密码' : '密码'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-white/10 dark:border-gray-700 bg-slate-800/50 dark:bg-gray-900 text-white dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {(mode === 'register' || mode === 'reset_password') && (
                <PasswordStrength password={formData.password} />
              )}
            </div>
          )}

          {/* Confirm Password */}
          {(mode === 'register' || mode === 'reset_password') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
                确认密码 <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-white/10 dark:border-gray-700 bg-slate-800/50 dark:bg-gray-900 text-white dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Forgot Password Link */}
          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode('forgot_password')}
                className="text-sm text-primary-purple dark:text-purple-400 hover:underline"
              >
                忘记密码？
              </button>
            </div>
          )}

          {/* Terms Agreement */}
          {mode === 'register' && (
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-white/20 dark:border-gray-600 text-primary-purple focus:ring-purple-500"
              />
              <label className="text-sm text-gray-400 dark:text-gray-400">
                我已阅读并同意{' '}
                <a href="/terms" className="text-primary-purple dark:text-purple-400 hover:underline">服务条款</a>
                {' '}和{' '}
                <a href="/privacy" className="text-primary-purple dark:text-purple-400 hover:underline">隐私政策</a>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                处理中...
              </span>
            ) : (
              <>
                {mode === 'login' && '登录'}
                {mode === 'register' && '注册'}
                {mode === 'forgot_password' && '发送重置链接'}
                {mode === 'reset_password' && '重置密码'}
              </>
            )}
          </button>
        </form>

        {/* Social Login */}
        {(mode === 'login' || mode === 'register') && (
          <div className="mt-6">
            <SocialLoginButtons onSocialLogin={onSocialLogin} isLoading={isLoading} />
          </div>
        )}

        {/* Mode Switch */}
        <div className="mt-6 text-center text-sm text-gray-400 dark:text-gray-400">
          {mode === 'login' && (
            <>
              还没有账户？{' '}
              <button onClick={() => setMode('register')} className="text-primary-purple dark:text-purple-400 font-medium hover:underline">
                立即注册
              </button>
            </>
          )}
          {mode === 'register' && (
            <>
              已有账户？{' '}
              <button onClick={() => setMode('login')} className="text-primary-purple dark:text-purple-400 font-medium hover:underline">
                立即登录
              </button>
            </>
          )}
          {(mode === 'forgot_password' || mode === 'reset_password') && (
            <button onClick={() => setMode('login')} className="text-primary-purple dark:text-purple-400 font-medium hover:underline">
              返回登录
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Export
// ============================================

export default AuthSystem;
