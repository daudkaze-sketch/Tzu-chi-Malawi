import { cookies } from 'next/headers';

import { SESSION_COOKIE, createToken, hashSecret, normalizeEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSessionCookieValue } from '@/lib/sessionCookie';

export async function createApprovedSession(emailInput: string) {
  const email = normalizeEmail(emailInput);
  const user = await prisma.user.findUnique({ where: { email } });
  const sessionToken = createToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.authSession.create({
    data: {
      tokenHash: hashSecret(sessionToken),
      email,
      userId: user?.id,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createSessionCookieValue(sessionToken), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}
