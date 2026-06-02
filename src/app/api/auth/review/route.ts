import { NextResponse } from 'next/server';

import { issueLoginCode } from '@/lib/accessFlow';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') ?? '';
  const decision = url.searchParams.get('decision');

  if (!token || (decision !== 'approve' && decision !== 'deny')) {
    return htmlResponse('Invalid link', 'This approval link is not valid.', 400);
  }

  const accessRequest = await prisma.accessRequest.findUnique({
    where: { adminToken: token },
  });

  if (!accessRequest) {
    return htmlResponse('Request not found', 'This access request could not be found.', 404);
  }

  if (decision === 'deny') {
    await prisma.accessRequest.update({
      where: { id: accessRequest.id },
      data: {
        status: 'DENIED',
        reviewedAt: new Date(),
      },
    });

    return htmlResponse('Access denied', `${accessRequest.email} was denied access.`);
  }

  const user = await prisma.user.upsert({
    where: { email: accessRequest.email },
    update: { status: 'active' },
    create: {
      email: accessRequest.email,
      name: accessRequest.name,
      status: 'active',
      role: 'STAFF',
    },
  });

  await prisma.accessRequest.update({
    where: { id: accessRequest.id },
    data: {
      status: 'APPROVED',
      reviewedAt: new Date(),
    },
  });

  await issueLoginCode(user.email ?? accessRequest.email);

  return htmlResponse(
    'Access approved',
    `${accessRequest.email} was approved. A login code has been sent to that email.`
  );
}

function htmlResponse(title: string, message: string, status = 200) {
  return new NextResponse(
    `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; }
          main { max-width: 560px; margin: 12vh auto; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08); }
          h1 { margin: 0 0 12px; font-size: 28px; }
          p { color: #475569; line-height: 1.5; }
          a { color: #1d4ed8; font-weight: 700; }
        </style>
      </head>
      <body>
        <main>
          <h1>${title}</h1>
          <p>${message}</p>
          <p><a href="/login">Go to login</a></p>
        </main>
      </body>
    </html>`,
    {
      status,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    }
  );
}
