'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Theme, ThemeConfig, getThemeConfig } from '@/types/coffee';
import { getUserTheme, saveUserTheme } from '@/lib/supabase';

interface ThemeContextType {
  currentTheme: Theme;
  themeConfig: ThemeConfig;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'tazita-theme';

export function ThemeProvider({ children, username }: { children: React.ReactNode; username: string | null }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('pompompurin');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from localStorage or Supabase on mount
  useEffect(() => {
    const loadTheme = async () => {
      setIsLoading(true);
      
      // First try to load from localStorage for quick display
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      if (storedTheme && ['pompompurin', 'cinnamoroll', 'hello_kitty', 'kuromi', 'keroppi'].includes(storedTheme)) {
        setCurrentTheme(storedTheme);
      }

      // If we have a username, try to load from Supabase
      if (username) {
        try {
          const userTheme = await getUserTheme(username);
          if (userTheme) {
            setCurrentTheme(userTheme);
            localStorage.setItem(THEME_STORAGE_KEY, userTheme);
          }
        } catch (error) {
          console.error('Error loading theme from Supabase:', error);
        }
      }
      
      setIsLoading(false);
    };

    loadTheme();
  }, [username]);

  const setTheme = useCallback(async (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Save to Supabase if we have a username
    if (username) {
      try {
        await saveUserTheme(username, theme);
      } catch (error) {
        console.error('Error saving theme to Supabase:', error);
      }
    }
  }, [username]);

  const themeConfig = getThemeConfig(currentTheme);

  // Apply CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const config = themeConfig;
    
    root.style.setProperty('--background', config.background);
    root.style.setProperty('--foreground', config.text);
    root.style.setProperty('--card', '#FFFFFF');
    root.style.setProperty('--card-foreground', config.text);
    root.style.setProperty('--popover', '#FFFFFF');
    root.style.setProperty('--popover-foreground', config.text);
    root.style.setProperty('--primary', config.primary);
    root.style.setProperty('--primary-foreground', config.text);
    root.style.setProperty('--secondary', config.secondary);
    root.style.setProperty('--secondary-foreground', config.text);
    root.style.setProperty('--muted', config.muted);
    root.style.setProperty('--muted-foreground', config.accent);
    root.style.setProperty('--accent', config.accent);
    root.style.setProperty('--accent-foreground', config.text);
    root.style.setProperty('--border', config.border);
    root.style.setProperty('--input', config.border);
    root.style.setProperty('--ring', config.primary);
    root.style.setProperty('--chart-1', config.primary);
    root.style.setProperty('--chart-2', config.accent);
    root.style.setProperty('--chart-3', config.text);
    root.style.setProperty('--chart-4', config.secondary);
    root.style.setProperty('--chart-5', config.text);
    
    // Update scrollbar colors
    const scrollbarTrack = document.querySelector('::-webkit-scrollbar-track') as HTMLElement;
    if (scrollbarTrack) {
      scrollbarTrack.style.background = config.background;
    }
  }, [themeConfig]);

  return (
    <ThemeContext.Provider value={{ currentTheme, themeConfig, setTheme, isLoading }}>
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
