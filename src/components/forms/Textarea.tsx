import React, { forwardRef, TextareaHTMLAttributes, useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      success,
      hint,
      maxLength,
      showCount = false,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      className = '',
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(0);
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // Update character count
    useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length);
      }
    }, [value]);

    // Auto resize functionality
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24;
        const minHeight = lineHeight * minRows;
        const maxHeight = lineHeight * maxRows;
        
        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        textarea.style.height = `${newHeight}px`;
      }
    }, [value, autoResize, minRows, maxRows]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      
      // Enforce max length
      if (maxLength && newValue.length > maxLength) {
        return;
      }

      setCharCount(newValue.length);
      onChange?.(e);
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
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            rows={autoResize ? minRows : props.rows || minRows}
            className={`
              w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
              bg-slate-800/50 dark:bg-gray-900
              border-white/20 dark:border-gray-700
              ${stateClasses}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              focus:outline-none focus:ring-4
              placeholder:text-gray-400 dark:placeholder:text-gray-300
              text-white dark:text-white
              resize-none
            `}
            {...props}
          />

          {/* Status icons */}
          {(error || success) && (
            <div className="absolute right-3 top-3">
              {error && <AlertCircle className="w-5 h-5 text-red-500" />}
              {success && !error && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-1.5">
          <div>
            {(error || success || hint) && (
              <p
                className={`text-sm ${
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

          {(showCount || maxLength) && (
            <p
              className={`text-sm ${
                maxLength && charCount >= maxLength
                  ? 'text-red-500'
                  : 'text-gray-400 dark:text-gray-400'
              }`}
            >
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
