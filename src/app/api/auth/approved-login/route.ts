import { NextResponse } from 'next/server';

import { normalizeEmail } from '@/lib/auth';
import { isPrimaryAdminEmail } from '@/lib/accessFlow';
import { prisma } from '@/lib/prisma';
import { createApprovedSession } from '@/lib/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : '';
  const adminCode = typeof body?.adminCode === 'string' ? body.adminCode.trim() : '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Enter a valid approved email address.' }, { status: 400 });
  }

  const accessRequest = await prisma.accessRequest.findUnique({ where: { email } });

  if (isPrimaryAdminEmail(email)) {
    const expectedCode = process.env.ADMIN_ACCESS_CODE || 'DAUD_98';

    if (adminCode !== expectedCode) {
      return NextResponse.json({ message: 'Invalid administrator code.' }, { status: 401 });
    }
  } else if (accessRequest?.status !== 'APPROVED') {
    return NextResponse.json(
      { message: 'This email is not approved yet. Please request approval first.' },
      { status: 403 }
    );
  }

  await createApprovedSession(email);

  return NextResponse.json({ message: 'Logged in successfully.' });
}
