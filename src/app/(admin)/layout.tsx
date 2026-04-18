import type { ReactNode } from 'react';
import { AdminNav } from '@/components/admin-nav';
import { requireAuth } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAuth();

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
