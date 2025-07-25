// Environment configuration with validation
interface EnvConfig {
  // Firebase
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_DATABASE_URL: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MEASUREMENT_ID: string;
  
  // ICP
  DFX_NETWORK?: string;
  INTERNET_IDENTITY_CANISTER_ID?: string;
  
  // App
  NODE_ENV: string;
  NEXT_PUBLIC_APP_URL?: string;
}

const getEnvVar = (key: string, required: boolean = true): string => {
  const value = process.env[key] || process.env[`NEXT_PUBLIC_${key}`];
  
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value || '';
};

export const env: EnvConfig = {
  // Firebase (all required)
  FIREBASE_API_KEY: getEnvVar('FIREBASE_API_KEY'),
  FIREBASE_AUTH_DOMAIN: getEnvVar('FIREBASE_AUTH_DOMAIN'),
  FIREBASE_DATABASE_URL: getEnvVar('FIREBASE_DATABASE_URL'),
  FIREBASE_PROJECT_ID: getEnvVar('FIREBASE_PROJECT_ID'),
  FIREBASE_STORAGE_BUCKET: getEnvVar('FIREBASE_STORAGE_BUCKET'),
  FIREBASE_MESSAGING_SENDER_ID: getEnvVar('FIREBASE_MESSAGING_SENDER_ID'),
  FIREBASE_APP_ID: getEnvVar('FIREBASE_APP_ID'),
  FIREBASE_MEASUREMENT_ID: getEnvVar('FIREBASE_MEASUREMENT_ID'),
  
  // ICP (optional)
  DFX_NETWORK: getEnvVar('DFX_NETWORK', false),
  INTERNET_IDENTITY_CANISTER_ID: getEnvVar('INTERNET_IDENTITY_CANISTER_ID', false),
  
  // App
  NODE_ENV: getEnvVar('NODE_ENV'),
  NEXT_PUBLIC_APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', false),
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';