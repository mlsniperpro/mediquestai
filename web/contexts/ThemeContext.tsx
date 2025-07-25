'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useTheme as useCustomTheme } from '@/hooks/useTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange={false}
      storageKey="mediquest-theme"
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  return useCustomTheme();
}