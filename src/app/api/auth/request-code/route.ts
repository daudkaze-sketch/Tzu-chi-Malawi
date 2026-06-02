import { NextResponse } from 'next/server';

import { issueLoginCode } from '@/lib/accessFlow';
import { normalizeEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Enter a valid approved email address.' }, { status: 400 });
  }

  const accessRequest = await prisma.accessRequest.findUnique({ where: { email } });

  if (accessRequest?.status !== 'APPROVED') {
    return NextResponse.json(
      { message: 'This email is not approved yet. Please request approval first.' },
      { status: 403 }
    );
  }

  await issueLoginCode(email);

  return NextResponse.json({
    message: 'Login code requested. The administrator will receive it and forward it to the approved person.',
  });
}
