import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'subtle';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface FollowButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
  to?: string;
  as?: 'button' | 'link';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const FollowButton: React.FC<FollowButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  to,
  as,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  // Base styles - unified across all buttons
  const baseStyles = [
    'inline-flex items-center justify-center',
    'font-medium text-sm',
    'h-10', // Default height
    'px-4 py-2', // Default padding
    'rounded-xl', // Unified border radius
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'active:scale-95',
  ].join(' ');

  // Variant styles
  const variantStyles = {
    primary: [
      'bg-gradient-to-r from-[#3BA7FF] to-[#0F6FFF]',
      'text-white',
      'hover:from-[#4BB7FF] hover:to-[#1F7FFF]',
      'hover:shadow-lg hover:shadow-blue-500/30',
      'active:from-[#2B97EF] active:to-[#005FEF]',
    ].join(' '),
    secondary: [
      'bg-slate-800',
      'text-white',
      'hover:bg-slate-700',
      'active:bg-slate-900',
    ].join(' '),
    ghost: [
      'bg-transparent',
      'text-slate-300',
      'hover:bg-slate-800/50',
      'active:bg-slate-800/70',
    ].join(' '),
    destructive: [
      'bg-red-600',
      'text-white',
      'hover:bg-red-700',
      'active:bg-red-800',
    ].join(' '),
    subtle: [
      'bg-slate-100 dark:bg-slate-800',
      'text-slate-700 dark:text-slate-300',
      'hover:bg-slate-200 dark:hover:bg-slate-700',
      'active:bg-slate-300 dark:active:bg-slate-600',
    ].join(' '),
  };

  // Size styles
  const sizeStyles = {
    sm: 'h-8 px-3 py-1.5 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 py-3 text-base',
  };

  // Icon size - unified
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  // Render icon
  const renderIcon = () => {
    if (isLoading) {
      return <Loader2 className={`h-4 w-4 animate-spin ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`} />;
    }
    if (Icon) {
      const IconComponent = Icon;
      return (
        <IconComponent
          size={iconSize}
          className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}
        />
      );
    }
    return null;
  };

  // Render content
  const renderContent = () => (
    <>
      {iconPosition === 'left' && renderIcon()}
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>{children}</span>
      )}
      {iconPosition === 'right' && !isLoading && renderIcon()}
    </>
  );

  // Link variant
  if (to || as === 'link') {
    return (
      <Link
        to={to || '#'}
        className={classes}
        {...(props as any)}
        onClick={(e) => {
          if (disabled || isLoading) {
            e.preventDefault();
            return;
          }
          props.onClick?.(e as any);
        }}
      >
        {renderContent()}
      </Link>
    );
  }

  // Button variant
  return (
    <motion.button
      className={classes}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
};

export default FollowButton;

