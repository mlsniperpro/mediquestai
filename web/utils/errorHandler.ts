// Centralized error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'auth/invalid-credentials',
  AUTH_USER_NOT_FOUND: 'auth/user-not-found',
  AUTH_EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  AUTH_WEAK_PASSWORD: 'auth/weak-password',
  AUTH_INVALID_EMAIL: 'auth/invalid-email',
  
  // Role selection errors
  ROLE_SELECTION_REQUIRED: 'role/selection-required',
  ROLE_INVALID_DATA: 'role/invalid-data',
  
  // ICP errors
  ICP_AUTH_FAILED: 'icp/auth-failed',
  ICP_CONNECTION_FAILED: 'icp/connection-failed',
  
  // General errors
  NETWORK_ERROR: 'network/error',
  UNKNOWN_ERROR: 'unknown/error',
} as const;

export const getErrorMessage = (error: any): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  // Firebase Auth errors
  switch (error?.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return error?.message || 'An unexpected error occurred. Please try again.';
  }
};

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  fallbackMessage: string = 'An error occurred'
): Promise<[T | null, string | null]> => {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error('Async operation failed:', error);
    return [null, errorMessage];
  }
};