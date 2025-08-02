/**
 * Theme Provider - Manages site-specific themes
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from '@/lib/types';
import { loadTheme, applyTheme } from './theme-loader';

interface ThemeContextType {
  theme: Theme | null;
  isLoading: boolean;
  error: string | null;
  reloadTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  siteId?: string;
  fallbackTheme?: string;
}

export function ThemeProvider({ 
  children, 
  siteId = process.env.NEXT_PUBLIC_COGNITOR_SITE_ID || 'default',
  fallbackTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME || 'default'
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSiteTheme = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedTheme = await loadTheme(siteId, fallbackTheme);
      setTheme(loadedTheme);
      
      // Apply theme to DOM
      if (loadedTheme) {
        applyTheme(loadedTheme);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load theme';
      setError(errorMessage);
      console.error('Theme loading error:', err);
      
      // Apply default theme on error
      try {
        const defaultTheme = await loadTheme('default', 'default');
        if (defaultTheme) {
          setTheme(defaultTheme);
          applyTheme(defaultTheme);
        }
      } catch (defaultErr) {
        console.error('Failed to load default theme:', defaultErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSiteTheme();
  }, [siteId, fallbackTheme]);

  const contextValue: ThemeContextType = {
    theme,
    isLoading,
    error,
    reloadTheme: loadSiteTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}