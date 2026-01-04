import React, { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'danger';
  showLabels?: boolean;
  onLabel?: string;
  offLabel?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      size = 'md',
      variant = 'default',
      showLabels = false,
      onLabel = 'On',
      offLabel = 'Off',
      className = '',
      disabled,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    const sizeConfig = {
      sm: {
        track: 'w-8 h-5',
        thumb: 'w-3.5 h-3.5',
        translate: 'translate-x-3.5',
        labelText: 'text-xs',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-4.5 h-4.5',
        translate: 'translate-x-5',
        labelText: 'text-sm',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-5.5 h-5.5',
        translate: 'translate-x-7',
        labelText: 'text-sm',
      },
    };

    const variantColors = {
      default: 'bg-gradient-to-r from-primary-cyan to-primary-blue',
      success: 'bg-green-500',
      danger: 'bg-red-500',
    };

    const config = sizeConfig[size];

    return (
      <label
        className={`flex items-start gap-3 cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <motion.div
            initial={false}
            animate={{
              backgroundColor: checked ? undefined : '#D1D5DB',
            }}
            className={`
              ${config.track} rounded-full transition-colors relative
              ${checked ? variantColors[variant] : 'bg-gray-300 dark:bg-gray-600'}
            `}
          >
            {/* Labels inside track */}
            {showLabels && (
              <>
                <span
                  className={`absolute left-1.5 top-1/2 -translate-y-1/2 ${config.labelText} font-medium text-white ${
                    checked ? 'opacity-100' : 'opacity-0'
                  } transition-opacity`}
                >
                  {onLabel}
                </span>
                <span
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 ${config.labelText} font-medium text-gray-400 ${
                    !checked ? 'opacity-100' : 'opacity-0'
                  } transition-opacity`}
                >
                  {offLabel}
                </span>
              </>
            )}

            {/* Thumb */}
            <motion.div
              initial={false}
              animate={{
                x: checked ? (size === 'sm' ? 14 : size === 'md' ? 20 : 28) : 2,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`
                absolute top-1/2 -translate-y-1/2
                ${size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}
                bg-slate-800/50 rounded-full shadow-md
              `}
            />
          </motion.div>
        </div>

        {(label || description) && (
          <div className="flex-1 pt-0.5">
            {label && (
              <span className="text-sm font-medium text-white dark:text-white">
                {label}
              </span>
            )}
            {description && (
              <p className="text-sm text-gray-400 dark:text-gray-300 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
