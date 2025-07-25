export type UserRole = 'individual' | 'healthcare_professional' | 'medical_facility';
export type AuthProvider = 'firebase' | 'icp' | 'google';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role?: UserRole;
  authenticationComplete: boolean;
  authProvider: AuthProvider;
  icpPrincipal?: string; // For ICP users
  createdAt: Date;
  updatedAt: Date;
  // Additional fields based on role
  facilityName?: string; // For medical facilities
  licenseNumber?: string; // For healthcare professionals
  specialization?: string; // For healthcare professionals
  // Profile settings
  preferences?: UserPreferences;
  // Security
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    dataSharing: boolean;
  };
}

export interface RoleSelectionData {
  role: UserRole;
  facilityName?: string;
  licenseNumber?: string;
  specialization?: string;
}

// Form types for better type safety
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth context types
export interface AuthState {
  user: any | null; // Firebase User or ICP mock user
  userProfile: UserProfile | null;
  loading: boolean;
  needsRoleSelection: boolean;
  authProvider: AuthProvider | null;
  icpPrincipal: string | null;
}