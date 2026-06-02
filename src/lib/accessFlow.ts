import { prisma } from '@/lib/prisma';
import { createLoginCode, createToken, getBaseUrl, hashSecret, normalizeEmail } from '@/lib/auth';
import { sendMail } from '@/lib/mail';

const PRIMARY_ADMIN_EMAIL = 'daud.kaze@gmail.com';

function getAdminEmail() {
  return process.env.ADMIN_EMAIL || PRIMARY_ADMIN_EMAIL;
}

export function isPrimaryAdminEmail(email: string) {
  return normalizeEmail(email) === normalizeEmail(getAdminEmail());
}

export async function sendAdminAccessReviewEmail({
  email,
  name,
  requestUrl,
  adminToken,
}: {
  email: string;
  name?: string | null;
  requestUrl: string;
  adminToken: string;
}) {
  const adminEmail = getAdminEmail();
  const baseUrl = getBaseUrl(requestUrl);
  const approveUrl = `${baseUrl}/api/auth/review?token=${adminToken}&decision=approve`;
  const denyUrl = `${baseUrl}/api/auth/review?token=${adminToken}&decision=deny`;
  const displayName = name ? `${name} <${email}>` : email;

  await sendMail({
    to: adminEmail,
    subject: `Access request: ${displayName}`,
    text: [
      `${displayName} requested access to Tzu Chi Malawi Office.`,
      '',
      `Approve: ${approveUrl}`,
      `Deny: ${denyUrl}`,
    ].join('\n'),
    html: `
      <p><strong>${displayName}</strong> requested access to Tzu Chi Malawi Office.</p>
      <p>
        <a href="${approveUrl}">Approve access</a><br />
        <a href="${denyUrl}">Deny access</a>
      </p>
    `,
  });
}

export async function issueLoginCode(emailInput: string) {
  const email = normalizeEmail(emailInput);
  const accessRequest = await prisma.accessRequest.findUnique({ where: { email } });
  const code = createLoginCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.loginCode.create({
    data: {
      email,
      codeHash: hashSecret(code),
      expiresAt,
    },
  });

  await prisma.accessRequest.update({
    where: { email },
    data: { codeSentAt: new Date() },
  });

  await sendMail({
    to: getAdminEmail(),
    subject: `Login code for ${accessRequest?.name || email}`,
    text: [
      `Approved user: ${accessRequest?.name || 'No name provided'}`,
      `Email: ${email}`,
      '',
      `Login code: ${code}`,
      'This code expires in 10 minutes.',
      '',
      'Forward this code only to the approved person.',
    ].join('\n'),
    html: `
      <p><strong>Approved user:</strong> ${accessRequest?.name || 'No name provided'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Login code:</strong> <span style="font-size: 22px; font-weight: 700; letter-spacing: 4px;">${code}</span></p>
      <p>This code expires in 10 minutes. Forward it only to the approved person.</p>
    `,
  });
}

export async function createAccessRequest(emailInput: string, name?: string | null) {
  const email = normalizeEmail(emailInput);
  const existing = await prisma.accessRequest.findUnique({ where: { email } });

  if (existing?.status === 'APPROVED') {
    await issueLoginCode(email);
    return { status: 'APPROVED' as const };
  }

  const adminToken = existing?.adminToken ?? createToken(24);

  const request = await prisma.accessRequest.upsert({
    where: { email },
    update: {
      name: name?.trim() || existing?.name,
      status: 'PENDING',
      adminToken,
      reviewedAt: null,
      requestedAt: new Date(),
    },
    create: {
      email,
      name: name?.trim() || null,
      adminToken,
    },
  });

  return { status: request.status as 'PENDING' | 'DENIED' | 'APPROVED', adminToken };
}
