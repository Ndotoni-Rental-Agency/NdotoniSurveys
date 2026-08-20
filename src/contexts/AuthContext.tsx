'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthBridge } from '@/lib/auth-bridge';
import { deleteCookie, setCookie } from '@/lib/utils/cookies';
import { AdminProfile } from '@/types/api';

interface AuthContextType {
  user: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const restoreSession = async () => {
    try {
      const hasSession = await AuthBridge.hasCognitoSession();
      if (!hasSession) {
        setUser(null);
        return;
      }

      const valid = await AuthBridge.hasValidSession();
      if (!valid) {
        await AuthBridge.signOutFromBridge();
        setUser(null);
        return;
      }

      const { getMe } = await import('@/graphql/queries');
      const { GraphQLClient } = await import('@/lib/graphql-client');
      const data = await GraphQLClient.executeAuthenticated<{ getMe: AdminProfile }>(getMe);

      if (data.getMe?.userType !== 'ADMIN') {
        await AuthBridge.signOutFromBridge();
        setUser(null);
        return;
      }

      setCookie('accessToken', 'COGNITO_MANAGED');
      setUser(data.getMe);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    const { user: profile } = await AuthBridge.signInWithAmplify(email, password);

    if (profile?.userType !== 'ADMIN') {
      await AuthBridge.signOutFromBridge();
      throw new Error('This app is only available to admins.');
    }

    setCookie('accessToken', 'COGNITO_MANAGED');
    setUser(profile);
  };

  const signOut = async () => {
    await AuthBridge.signOutFromBridge();
    deleteCookie('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
