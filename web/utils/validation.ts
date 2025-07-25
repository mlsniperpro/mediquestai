import { VALIDATION } from '@/config/constants';
import { UserRole, RoleSelectionData } from '@/types/user';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email.trim()) {
    errors.push('Email is required');
  } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateDisplayName = (displayName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (displayName && displayName.trim().length < 2) {
    errors.push('Display name must be at least 2 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRoleSelection = (roleData: RoleSelectionData): ValidationResult => {
  const errors: string[] = [];
  
  if (!roleData.role) {
    errors.push('Please select a user role');
  }
  
  if (roleData.role === 'healthcare_professional') {
    if (!roleData.licenseNumber?.trim()) {
      errors.push('License number is required for healthcare professionals');
    }
  }
  
  if (roleData.role === 'medical_facility') {
    if (!roleData.facilityName?.trim()) {
      errors.push('Facility name is required for medical facilities');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignUpForm = (
  email: string,
  password: string,
  confirmPassword: string,
  displayName?: string
): ValidationResult => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const confirmPasswordValidation = validatePasswordConfirmation(password, confirmPassword);
  const displayNameValidation = displayName ? validateDisplayName(displayName) : { isValid: true, errors: [] };
  
  const allErrors = [
    ...emailValidation.errors,
    ...passwordValidation.errors,
    ...confirmPasswordValidation.errors,
    ...displayNameValidation.errors,
  ];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

export const validateSignInForm = (email: string, password: string): ValidationResult => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  
  const allErrors = [...emailValidation.errors, ...passwordValidation.errors];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};