import { NextResponse } from 'next/server';

import { hashSecret, normalizeEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createApprovedSession } from '@/lib/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : '';
  const code = typeof body?.code === 'string' ? body.code.trim() : '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ message: 'Enter your email and six-digit code.' }, { status: 400 });
  }

  const accessRequest = await prisma.accessRequest.findUnique({ where: { email } });

  if (accessRequest?.status !== 'APPROVED') {
    return NextResponse.json({ message: 'This email has not been approved yet.' }, { status: 403 });
  }

  const loginCode = await prisma.loginCode.findFirst({
    where: {
      email,
      codeHash: hashSecret(code),
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!loginCode) {
    return NextResponse.json({ message: 'Invalid or expired code.' }, { status: 401 });
  }

  await prisma.loginCode.update({
    where: { id: loginCode.id },
    data: { usedAt: new Date() },
  });

  await createApprovedSession(email);

  return NextResponse.json({ message: 'Logged in successfully.' });
}
