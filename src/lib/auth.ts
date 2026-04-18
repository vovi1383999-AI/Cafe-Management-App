import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'node:crypto';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/db';
import { AUTH_COOKIE, APP_ROUTES } from '@/lib/constants';

export type SessionUser = {
  id: string;
  fullName: string;
  role: UserRole;
  email: string;
};

const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionTokenPayload = {
  sub: string;
  exp: number;
};

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is required');
  return secret;
}

function signPayload(payloadPart: string) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payloadPart).digest('base64url');
}

export function createSessionToken(userId: string) {
  const payload: SessionTokenPayload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const payloadPart = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(payloadPart);
  return `${payloadPart}.${signature}`;
}

function readSessionToken(token: string): SessionTokenPayload | null {
  const [payloadPart, signature] = token.split('.');
  if (!payloadPart || !signature) return null;

  const expectedSig = signPayload(payloadPart);
  const expectedSigBuffer = Buffer.from(expectedSig);
  const providedSigBuffer = Buffer.from(signature);
  if (
    expectedSigBuffer.length !== providedSigBuffer.length ||
    !crypto.timingSafeEqual(expectedSigBuffer, providedSigBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(payloadPart)) as SessionTokenPayload;
    if (!payload.sub || !payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const session = readSessionToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
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
