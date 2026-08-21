'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthBridge } from '@/lib/auth-bridge';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshUser, isAuthenticated } = useAuth();
  const handledRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const handleCallback = async () => {
      const sessionReady = await AuthBridge.waitForOAuthSession();
      if (!sessionReady) {
        setError('Sign in did not complete. Please try again.');
        return;
      }

      await refreshUser();

      const stillSignedIn = await AuthBridge.hasCognitoSession();
      if (!stillSignedIn) {
        router.replace('/not-authorized');
      }
    };

    handleCallback();
  }, [refreshUser]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => router.replace('/login')}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}
