import crypto from 'crypto';

export const SESSION_COOKIE = 'tzu_chi_session';

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

export function createLoginCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashSecret(secret: string) {
  return crypto.createHash('sha256').update(secret).digest('hex');
}

export function getBaseUrl(requestUrl?: string) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, '');
  }

  if (requestUrl) {
    const url = new URL(requestUrl);
    return `${url.protocol}//${url.host}`;
  }

  return 'http://localhost:3000';
}
