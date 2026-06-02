import { NextResponse } from 'next/server';

import { createAccessRequest, sendAdminAccessReviewEmail } from '@/lib/accessFlow';
import { normalizeEmail } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : '';
  const name = typeof body?.name === 'string' ? body.name.trim() : '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
  }

  const result = await createAccessRequest(email, name);

  if (result.status === 'APPROVED') {
    return NextResponse.json({
      message: 'Access already approved. A new code was sent to your email.',
      approved: true,
    });
  }

  await sendAdminAccessReviewEmail({
    email,
    name,
    requestUrl: request.url,
    adminToken: result.adminToken,
  });

  return NextResponse.json({
    message: 'Request sent. Wait for the administrator to approve your access.',
  });
}
