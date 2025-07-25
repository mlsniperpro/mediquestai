import { clsx, type ClassValue } from 'clsx';

// Utility function for conditional class names
// Note: This is a simplified version. In a real project, you might want to use 'tailwind-merge' as well
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}