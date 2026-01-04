import React, { forwardRef, InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      indeterminate = false,
      size = 'md',
      className = '',
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const iconSizes = {
      sm: 12,
      md: 14,
      lg: 16,
    };

    const isChecked = checked || indeterminate;

    return (
      <label
        className={`flex items-start gap-3 cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <motion.div
            initial={false}
            animate={{
              backgroundColor: isChecked ? '#3B82F6' : 'transparent',
              borderColor: isChecked ? '#3B82F6' : error ? '#EF4444' : '#D1D5DB',
            }}
            className={`
              ${sizeClasses[size]} rounded-md border-2 flex items-center justify-center
              transition-colors
              ${!disabled && !isChecked ? 'hover:border-blue-400' : ''}
            `}
          >
            {isChecked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {indeterminate ? (
                  <Minus className="text-white" size={iconSizes[size]} />
                ) : (
                  <Check className="text-white" size={iconSizes[size]} />
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {(label || description) && (
          <div className="flex-1">
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
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Radio component
interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      error,
      size = 'md',
      className = '',
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const dotSizes = {
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
    };

    return (
      <label
        className={`flex items-start gap-3 cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="radio"
            checked={checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <motion.div
            initial={false}
            animate={{
              borderColor: checked ? '#3B82F6' : error ? '#EF4444' : '#D1D5DB',
            }}
            className={`
              ${sizeClasses[size]} rounded-full border-2 flex items-center justify-center
              transition-colors bg-slate-800/50 dark:bg-gray-900
              ${!disabled && !checked ? 'hover:border-blue-400' : ''}
            `}
          >
            {checked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`${dotSizes[size]} rounded-full bg-gradient-to-r from-primary-cyan to-primary-blue`}
              />
            )}
          </motion.div>
        </div>

        {(label || description) && (
          <div className="flex-1">
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
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

// Radio Group component
interface RadioGroupProps {
  name: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  orientation = 'vertical',
  className = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <p className="text-sm font-medium text-gray-300 dark:text-gray-300 mb-3">
          {label}
        </p>
      )}
      <div
        className={`flex ${
          orientation === 'horizontal' ? 'flex-row flex-wrap gap-6' : 'flex-col gap-3'
        }`}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
          />
        ))}
      </div>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Checkbox;
