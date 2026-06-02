import { NextResponse, type NextRequest } from 'next/server';

import { SESSION_COOKIE } from '@/lib/auth';
import { readSessionToken } from '@/lib/sessionCookie';

const publicPaths = ['/login'];
const publicApiPaths = [
  '/api/auth/approved-login',
  '/api/auth/request-access',
  '/api/auth/request-code',
  '/api/auth/review',
  '/api/auth/verify-code',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value));

  if (pathname === '/login' && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (publicPaths.includes(pathname) || publicApiPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!hasSession) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
