function getSessionSecret() {
  return process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'development-session-secret';
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSessionCookieValue(token: string) {
  return `${token}.${await sign(token)}`;
}

export async function readSessionToken(cookieValue?: string) {
  if (!cookieValue) {
    return null;
  }

  const [token, signature] = cookieValue.split('.');
  if (!token || !signature) {
    return null;
  }

  const expected = await sign(token);
  return expected === signature ? token : null;
}
