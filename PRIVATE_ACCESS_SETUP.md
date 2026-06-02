# Private Access Login Setup

This branch adds a private access flow for the Tzu Chi Malawi site:

1. A visitor requests access with name and email at `/login`.
2. The administrator receives an email with approve and deny links.
3. When approved, `daud.kaze@gmail.com` receives the six-digit login code.
4. The visitor can enter that code on the access-code screen.
5. If a person is already approved, they can use the "Already approved" button, enter only their email, and access the system without a code.
6. The primary administrator must enter `daud.kaze@gmail.com` plus the administrator code.

## Environment variables

Add these values in `.env` locally and in Vercel/Supabase production settings:

```env
ADMIN_EMAIL="daud.kaze@gmail.com"
ADMIN_ACCESS_CODE="DAUD_98"
NEXT_PUBLIC_SITE_URL="https://your-site-url.com"
EMAIL_FROM="Tzu Chi Malawi <noreply@example.org>"
SMTP_HOST="smtp.example.org"
SMTP_PORT="587"
SMTP_USER="smtp-user"
SMTP_PASS="smtp-password"
JWT_SECRET="use-a-long-random-secret"
```

If SMTP is not configured in development, email contents are printed in the server terminal.

## Database

The new Prisma models are `AccessRequest`, `LoginCode`, and `AuthSession`.

Because the existing Prisma migration history in this repo was originally locked to SQLite while the current datasource is PostgreSQL/Supabase, apply the SQL from:

```text
prisma/migrations/20260601150000_private_access_flow/migration.sql
```

to the Supabase SQL editor, or regenerate a clean PostgreSQL migration history before using `prisma migrate deploy`.
