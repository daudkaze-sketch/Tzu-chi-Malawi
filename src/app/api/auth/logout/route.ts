import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { SESSION_COOKIE, hashSecret } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { readSessionToken } from '@/lib/sessionCookie';

export async function POST() {
  const cookieStore = await cookies();
  const token = await readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (token) {
    await prisma.authSession.deleteMany({
      where: { tokenHash: hashSecret(token) },
    });
  }

  cookieStore.delete(SESSION_COOKIE);

  return NextResponse.json({ message: 'Logged out.' });
}
