import { useState, useCallback } from 'react';
import { ValidationResult } from '@/utils/validation';

export interface UseFormValidationReturn<T> {
  values: T;
  errors: Record<keyof T, string[]>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setValues: (newValues: Partial<T>) => void;
  validateField: (field: keyof T, validator: (value: any) => ValidationResult) => void;
  validateForm: (validators: Record<keyof T, (value: any) => ValidationResult>) => boolean;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  setError: (field: keyof T, errors: string[]) => void;
  clearErrors: () => void;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T
): UseFormValidationReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string[]>>({} as Record<keyof T, string[]>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    // Clear errors for this field when value changes
    if (errors[field]?.length > 0) {
      setErrors(prev => ({ ...prev, [field]: [] }));
    }
  }, [errors]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback((field: keyof T, fieldErrors: string[]) => {
    setErrors(prev => ({ ...prev, [field]: fieldErrors }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({} as Record<keyof T, string[]>);
  }, []);

  const validateField = useCallback((field: keyof T, validator: (value: any) => ValidationResult) => {
    const result = validator(values[field]);
    setErrors(prev => ({ ...prev, [field]: result.errors }));
    return result.isValid;
  }, [values]);

  const validateForm = useCallback((validators: Record<keyof T, (value: any) => ValidationResult>) => {
    const newErrors = {} as Record<keyof T, string[]>;
    let isFormValid = true;

    Object.keys(validators).forEach(field => {
      const validator = validators[field as keyof T];
      const result = validator(values[field as keyof T]);
      newErrors[field as keyof T] = result.errors;
      if (!result.isValid) {
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, [values]);

  const handleSubmit = useCallback((onSubmit: (values: T) => Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values]);

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({} as Record<keyof T, string[]>);
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = Object.values(errors).every(fieldErrors => fieldErrors.length === 0);

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    setValue,
    setValues,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    setError,
    clearErrors,
  };
}