'use client';

import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

const NDOTONISTAYS_URL = 'https://ndotonistays.com';

export default function NotAuthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 bg-brand-radial flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center animate-pop-in">
        <div className="h-14 w-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
          <LockClosedIcon className="h-6 w-6 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nothing here for you</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
          Ndotoni Surveys is for the internal team only — there's nothing for
          your account to do here right now.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 mb-8">
          If you're an admin, make sure you're signing in with your admin
          email address — not a personal account.
        </p>
        <a href={NDOTONISTAYS_URL} className="block">
          <Button fullWidth>Go to ndotonistays.com</Button>
        </a>
        <Link
          href="/login"
          className="block mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          Sign in with a different account
        </Link>
      </div>
    </div>
  );
}
