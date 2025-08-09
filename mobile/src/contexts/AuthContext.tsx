import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { authApi, userApi, setAuthToken, clearAuthToken, initializeAuth } from '../services/api';

interface User {
  id: number;
  stravaId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  currency: number;
  totalScore: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithStrava: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for deep links (auth callbacks)
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      const parsed = Linking.parse(url);
      if (parsed.hostname === 'auth' && parsed.queryParams?.token) {
        handleAuthToken(parsed.queryParams.token as string);
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    
    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, []);

  const handleAuthToken = async (token: string) => {
    try {
      setIsLoading(true);
      await setAuthToken(token);
      const userData = await userApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Auth token error:', error);
      await clearAuthToken();
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithStrava = async () => {
    try {
      setIsLoading(true);
      const { authUrl } = await authApi.getStravaAuthUrl();
      // Open the Strava auth URL in browser, which will redirect back to our app
      await Linking.openURL(`${authUrl}&mobile=true`);
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await clearAuthToken();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await userApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, user might need to re-authenticate
      await signOut();
    }
  };

  useEffect(() => {
    // Initialize auth on app start
    const initAuth = async () => {
      try {
        await initializeAuth();
        const userData = await userApi.getProfile();
        setUser(userData);
      } catch (error) {
        // User is not authenticated or token is invalid
        await clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    signInWithStrava,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}