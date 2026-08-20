'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Header } from '@/components/layout/Header';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </AuthGuard>
  );
}
