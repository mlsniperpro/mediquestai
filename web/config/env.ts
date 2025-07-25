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
  const value = process.env[key];
  
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value || '';
};

// Use getter functions to access environment variables lazily
export const env: EnvConfig = {
  // Firebase (all required) - access process.env directly
  get FIREBASE_API_KEY() { return process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (() => { throw new Error('Missing required environment variable: NEXT_PUBLIC_FIREBASE_API_KEY'); })(); },
  get FIREBASE_AUTH_DOMAIN() { return process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (() => { throw new Error('Missing required environment variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'); })(); },
  get FIREBASE_DATABASE_URL() { return process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || (() => { throw new Error('Missing required environment variable: NEXT_PUBLIC_FIREBASE_DATABASE_URL'); })(); },
  get FIREBASE_PROJECT_ID() { return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (() => { throw new Error('Missing required environment variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID'); })(); },
  get FIREBASE_STORAGE_BUCKET() { return process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (() => { throw new Error('Missing required environment variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'); })(); },
  get FIREBASE_MESSAGING_SENDER_ID() { return process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (() => { throw new Error('Missing required environment variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'); })(); },
  get FIREBASE_APP_ID() { return process.env.NEXT_PUBLIC_FIREBASE_APP_ID || (() => { throw new Error('Missing required environment variable: NEXT_PUBLIC_FIREBASE_APP_ID'); })(); },
  get FIREBASE_MEASUREMENT_ID() { return process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || (() => { throw new Error('Missing required environment variable: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'); })(); },
  
  // ICP (optional)
  get DFX_NETWORK() { return process.env.NEXT_PUBLIC_DFX_NETWORK || ''; },
  get INTERNET_IDENTITY_CANISTER_ID() { return process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || ''; },
  
  // App
  get NODE_ENV() { return process.env.NODE_ENV || 'development'; },
  get NEXT_PUBLIC_APP_URL() { return process.env.NEXT_PUBLIC_APP_URL || ''; },
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';