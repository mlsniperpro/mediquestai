// Application constants and configuration
export const APP_CONFIG = {
  name: 'MediQuestAI',
  description: 'Secure authentication system with Firebase',
  version: '0.1.0',
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ROLE_SELECTION: '/role-selection',
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
} as const;

export const USER_ROLES = {
  INDIVIDUAL: 'individual',
  HEALTHCARE_PROFESSIONAL: 'healthcare_professional',
  MEDICAL_FACILITY: 'medical_facility',
} as const;

export const AUTH_PROVIDERS = {
  FIREBASE: 'firebase',
  GOOGLE: 'google',
  ICP: 'icp',
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const UI = {
  LOADING_SPINNER_SIZE: 'h-32 w-32',
  ANIMATION_DURATION: 300,
} as const;