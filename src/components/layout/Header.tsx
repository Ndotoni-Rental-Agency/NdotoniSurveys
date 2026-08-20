'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-stone-100 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Ndotoni Surveys</p>
          {user?.email && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>
  );
}
