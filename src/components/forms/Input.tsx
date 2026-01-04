import React, { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  variant?: 'default' | 'filled' | 'outline';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      hint,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      variant = 'default',
      className = '',
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle
      ? showPassword
        ? 'text'
        : 'password'
      : type;

    const variantClasses = {
      default: 'bg-slate-800/50 dark:bg-gray-900 border-white/20 dark:border-gray-700',
      filled: 'bg-slate-800/50/10 dark:bg-gray-800 border-transparent',
      outline: 'bg-transparent border-white/20 dark:border-gray-700',
    };

    const stateClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : success
      ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
      : 'focus:border-blue-500 focus:ring-blue-500/20';

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
              ${variantClasses[variant]}
              ${stateClasses}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || showPasswordToggle || error || success ? 'pr-10' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              focus:outline-none focus:ring-4
              placeholder:text-gray-400 dark:placeholder:text-gray-300
              text-white dark:text-white
            `}
            {...props}
          />

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {error && <AlertCircle className="w-5 h-5 text-red-500" />}
            {success && !error && <CheckCircle className="w-5 h-5 text-green-500" />}
            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
            {rightIcon && !error && !success && !showPasswordToggle && rightIcon}
          </div>
        </div>

        {/* Helper text */}
        {(error || success || hint) && (
          <p
            className={`mt-1.5 text-sm ${
              error
                ? 'text-red-500'
                : success
                ? 'text-green-500'
                : 'text-gray-400 dark:text-gray-300'
            }`}
          >
            {error || success || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
