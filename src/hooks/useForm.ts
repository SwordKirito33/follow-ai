// Form Management Hooks for Follow.ai
// Provides form state management, validation, and submission handling

import { useState, useCallback, useMemo } from 'react';

// ============================================
// Types
// ============================================

type ValidationRule<T> = {
  validate: (value: T, formData?: Record<string, unknown>) => boolean;
  message: string;
};

type FieldConfig<T> = {
  initialValue: T;
  rules?: ValidationRule<T>[];
};

type FormConfig<T extends Record<string, unknown>> = {
  [K in keyof T]: FieldConfig<T[K]>;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

type FormTouched<T> = {
  [K in keyof T]?: boolean;
};

interface UseFormReturn<T extends Record<string, unknown>> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  setTouched: <K extends keyof T>(field: K, isTouched?: boolean) => void;
  validateField: <K extends keyof T>(field: K) => boolean;
  validateForm: () => boolean;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
  getFieldProps: <K extends keyof T>(field: K) => {
    value: T[K];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    name: string;
  };
}

// ============================================
// Common Validation Rules
// ============================================

export const validators = {
  required: (message = 'This field is required'): ValidationRule<unknown> => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined;
    },
    message,
  }),

  email: (message = 'Please enter a valid email'): ValidationRule<string> => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  min: (min: number, message?: string): ValidationRule<number> => ({
    validate: (value) => value >= min,
    message: message || `Must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule<number> => ({
    validate: (value) => value <= max,
    message: message || `Must be no more than ${max}`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    validate: (value) => regex.test(value),
    message,
  }),

  match: (fieldName: string, message?: string): ValidationRule<string> => ({
    validate: (value, formData) => value === formData?.[fieldName],
    message: message || `Must match ${fieldName}`,
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule<string> => ({
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  password: (message = 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number'): ValidationRule<string> => ({
    validate: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value),
    message,
  }),

  username: (message = 'Username can only contain letters, numbers, and underscores'): ValidationRule<string> => ({
    validate: (value) => /^[a-zA-Z0-9_]{3,20}$/.test(value),
    message,
  }),
};

// ============================================
// useForm Hook
// ============================================

export function useForm<T extends Record<string, unknown>>(
  config: FormConfig<T>
): UseFormReturn<T> {
  // Extract initial values
  const initialValues = useMemo(() => {
    const values: Record<string, unknown> = {};
    for (const key in config) {
      values[key] = config[key].initialValue;
    }
    return values as T;
  }, []);

  // State
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouchedState] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    for (const key in values) {
      if (values[key] !== initialValues[key]) return true;
    }
    return false;
  }, [values, initialValues]);

  // Validate a single field
  const validateField = useCallback(
    <K extends keyof T>(field: K): boolean => {
      const fieldConfig = config[field];
      const value = values[field];
      const rules = fieldConfig.rules || [];

      for (const rule of rules) {
        if (!rule.validate(value as T[K], values as Record<string, unknown>)) {
          setErrors((prev) => ({ ...prev, [field]: rule.message }));
          return false;
        }
      }

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    },
    [config, values]
  );

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newErrors: FormErrors<T> = {};

    for (const field in config) {
      const fieldConfig = config[field];
      const value = values[field];
      const rules = fieldConfig.rules || [];

      for (const rule of rules) {
        if (!rule.validate(value as T[typeof field], values as Record<string, unknown>)) {
          newErrors[field] = rule.message;
          isValid = false;
          break;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [config, values]);

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Set single value
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Set multiple values
  const setValuesCallback = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  // Set error for a field
  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // Set touched state for a field
  const setTouched = useCallback(<K extends keyof T>(field: K, isTouched = true) => {
    setTouchedState((prev) => ({ ...prev, [field]: isTouched }));
    if (isTouched) {
      validateField(field);
    }
  }, [validateField]);

  // Handle form submission
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void> | void) => {
      return async (e?: React.FormEvent) => {
        e?.preventDefault();

        // Mark all fields as touched
        const allTouched: FormTouched<T> = {};
        for (const key in config) {
          allTouched[key] = true;
        }
        setTouchedState(allTouched);

        // Validate form
        if (!validateForm()) {
          return;
        }

        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [config, validateForm, values]
  );

  // Reset form to initial values
  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  // Get props for a field
  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => ({
      value: values[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const value = target.type === 'checkbox' 
          ? (target as HTMLInputElement).checked 
          : target.value;
        setValue(field, value as T[K]);
      },
      onBlur: () => setTouched(field, true),
      name: String(field),
    }),
    [values, setValue, setTouched]
  );

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    setValue,
    setValues: setValuesCallback,
    setError,
    setTouched,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    getFieldProps,
  };
}

// ============================================
// useFormField Hook (for individual fields)
// ============================================

interface UseFormFieldOptions<T> {
  initialValue: T;
  validate?: (value: T) => string | undefined;
}

export function useFormField<T>({ initialValue, validate }: UseFormFieldOptions<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((newValue: T) => {
    setValue(newValue);
    if (touched && validate) {
      setError(validate(newValue));
    }
  }, [touched, validate]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      setError(validate(value));
    }
  }, [validate, value]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(undefined);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    setValue: handleChange,
    setError,
    onBlur: handleBlur,
    reset,
  };
}

// ============================================
// Export
// ============================================

export default useForm;
