import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/db';
import { AUTH_COOKIE, APP_ROUTES } from '@/lib/constants';

export type SessionUser = {
  id: string;
  fullName: string;
  role: UserRole;
  email: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(AUTH_COOKIE)?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, role: true, email: true, isActive: true }
  });

  if (!user || !user.isActive) return null;
  return user;
}

export async function requireAuth(roles?: UserRole[]) {
  const user = await getSessionUser();
  if (!user) redirect(APP_ROUTES.login);

  if (roles && !roles.includes(user.role)) {
    redirect(APP_ROUTES.dashboard);
  }

  return user;
}
