'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return system theme during SSR to prevent hydration mismatch
  if (!mounted) {
    return {
      theme: 'system',
      setTheme,
      resolvedTheme: 'light',
      mounted: false
    };
  }

  return {
    theme,
    setTheme,
    resolvedTheme,
    mounted: true
  };
}