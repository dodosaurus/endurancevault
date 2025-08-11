import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    card: string;
    disabled: string;
    accent: string;
  };
  isDark: boolean;
}

const lightTheme: Theme = {
  colors: {
    background: '#f8f9fa',
    surface: '#ffffff',
    primary: '#FF6B35',
    secondary: '#FFD700',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    card: '#ffffff',
    disabled: '#cccccc',
    accent: '#FF6B35',
  },
  isDark: false,
};

const darkTheme: Theme = {
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#FF6B35',
    secondary: '#FFD700',
    text: '#ffffff',
    textSecondary: '#b3b3b3',
    border: '#333333',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    card: '#2d2d2d',
    disabled: '#555555',
    accent: '#FF6B35',
  },
  isDark: true,
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = 'endurance_vault_theme';

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDark(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save theme preference to storage
  const saveThemePreference = async (darkMode: boolean) => {
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, JSON.stringify(darkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveThemePreference(newTheme);
  };

  const setTheme = (darkMode: boolean) => {
    setIsDark(darkMode);
    saveThemePreference(darkMode);
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };

  // Don't render children until theme is loaded
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}