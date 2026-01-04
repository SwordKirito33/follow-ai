// Form Elements for Follow-ai
// Enhanced form inputs with validation and accessibility

import React, { useState, useId, forwardRef } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; description?: string; disabled?: boolean }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ============================================
// Input Component
// ============================================

const sizeClasses = {
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2.5 px-4 text-base',
  lg: 'py-3 px-5 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, size = 'md', className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1"
          >
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
            id={inputId}
            className={cn(
              'w-full rounded-lg border transition-colors',
              'bg-white dark:bg-gray-900',
              'text-white dark:text-white',
              'placeholder-gray-400 dark:placeholder-gray-500',
              'focus:outline-none focus:ring-2',
              error
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-white/10 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20',
              sizeClasses[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              props.disabled && 'opacity-50 cursor-not-allowed bg-white/5 dark:bg-gray-800'
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1 text-sm text-gray-400 dark:text-gray-300">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================
// Textarea Component
// ============================================

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, maxLength, showCount = false, className, id, value, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={cn(
            'w-full rounded-lg border py-2.5 px-4 transition-colors resize-none',
            'bg-white dark:bg-gray-900',
            'text-white dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-white/10 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20',
            props.disabled && 'opacity-50 cursor-not-allowed bg-white/5 dark:bg-gray-800'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error ? (
            <p id={`${textareaId}-error`} className="text-sm text-red-500">
              {error}
            </p>
          ) : hint ? (
            <p id={`${textareaId}-hint`} className="text-sm text-gray-400 dark:text-gray-300">
              {hint}
            </p>
          ) : (
            <span />
          )}
          {showCount && maxLength && (
            <p className={cn(
              'text-sm',
              currentLength >= maxLength ? 'text-red-500' : 'text-gray-400'
            )}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ============================================
// Select Component
// ============================================

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full rounded-lg border py-2.5 px-4 pr-10 transition-colors appearance-none',
              'bg-white dark:bg-gray-900',
              'text-white dark:text-white',
              'focus:outline-none focus:ring-2',
              error
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-white/10 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20',
              props.disabled && 'opacity-50 cursor-not-allowed bg-white/5 dark:bg-gray-800'
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="mt-1 text-sm text-gray-400 dark:text-gray-300">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ============================================
// Checkbox Component
// ============================================

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={cn(
            'mt-0.5 w-4 h-4 rounded border-white/20 dark:border-gray-600',
            'text-primary-purple focus:ring-purple-500 focus:ring-offset-0',
            'bg-white dark:bg-gray-900',
            props.disabled && 'opacity-50 cursor-not-allowed'
          )}
          {...props}
        />
        {(label || description) && (
          <div>
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium text-gray-300 dark:text-gray-300',
                  props.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-400 dark:text-gray-300">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ============================================
// Radio Group Component
// ============================================

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  return (
    <div
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
      role="radiogroup"
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-start gap-3 cursor-pointer',
            option.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            disabled={option.disabled}
            className={cn(
              'mt-0.5 w-4 h-4 border-white/20 dark:border-gray-600',
              'text-primary-purple focus:ring-purple-500 focus:ring-offset-0',
              'bg-white dark:bg-gray-900'
            )}
          />
          <div>
            <span className="text-sm font-medium text-gray-300 dark:text-gray-300">
              {option.label}
            </span>
            {option.description && (
              <p className="text-sm text-gray-400 dark:text-gray-300">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

// ============================================
// Switch Component
// ============================================

const switchSizeClasses = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
};

export function Switch({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className,
}: SwitchProps) {
  const id = useId();
  const sizeClass = switchSizeClasses[size];

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative inline-flex shrink-0 rounded-full transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
          sizeClass.track,
          checked ? 'bg-purple-600' : 'bg-white/10 dark:bg-gray-700',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow transform transition-transform duration-200',
            sizeClass.thumb,
            checked ? sizeClass.translate : 'translate-x-0.5',
            'mt-0.5'
          )}
        />
      </button>
      {(label || description) && (
        <div>
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'text-sm font-medium text-gray-300 dark:text-gray-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-400 dark:text-gray-300">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// File Input Component
// ============================================

interface FileInputProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onChange?: (files: File[]) => void;
  error?: string;
  hint?: string;
  className?: string;
}

export function FileInput({
  label,
  accept,
  multiple = false,
  maxSize,
  onChange,
  error,
  hint,
  className,
}: FileInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    
    if (maxSize) {
      const validFiles = fileArray.filter((file) => file.size <= maxSize);
      onChange?.(validFiles);
    } else {
      onChange?.(fileArray);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          dragActive
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
            : 'border-white/10 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600',
          error && 'border-red-500'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-400">
          <span className="font-medium text-primary-purple dark:text-purple-400">点击上传</span>
          {' '}或拖拽文件到此处
        </p>
        {accept && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-400">
            支持的格式: {accept}
          </p>
        )}
        {maxSize && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-400">
            最大文件大小: {(maxSize / 1024 / 1024).toFixed(1)} MB
          </p>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-300">{hint}</p>
      )}
    </div>
  );
}

// ============================================
// Search Input Component
// ============================================

interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
}

export function SearchInput({ onSearch, onClear, value, onChange, ...props }: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && typeof value === 'string') {
      onSearch?.(value);
    }
  };

  return (
    <Input
      type="search"
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      leftIcon={
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      rightIcon={
        value ? (
          <button
            type="button"
            onClick={() => {
              onClear?.();
            }}
            className="hover:text-gray-400 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : undefined
      }
      {...props}
    />
  );
}

// ============================================
// Export All
// ============================================

export default {
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  FileInput,
  SearchInput,
};
