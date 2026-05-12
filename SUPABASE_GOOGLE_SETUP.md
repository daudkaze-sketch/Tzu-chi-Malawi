# Supabase + Google OAuth Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `tzu-chi-malawi`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
4. Click **Create new project** and wait 2-3 minutes

## Step 2: Get Supabase Connection String

1. Go to **Settings → Database**
2. Find **Connection String** section
3. Click **URI** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

Example: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public`

## Step 3: Set Up Google OAuth

### Get Google Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a **New Project** (name: "Tzu Chi Malawi")
3. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Choose **Web application**
5. Add Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-production-domain.com/api/auth/callback/google
   ```
6. Copy **Client ID** and **Client Secret**

## Step 4: Update Environment Variables

Edit `.env`:

```bash
# Supabase Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"

# NextAuth Configuration
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# JWT (keep for backward compatibility)
JWT_SECRET="your-jwt-secret-change-in-production"
```

To generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Step 5: Migrate Database

```bash
npx prisma migrate deploy
```

Or if you want to start fresh:
```bash
npx prisma migrate reset
```

## Step 6: Test the Setup

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000

3. Click **Login** or **Register**

4. You should see **Google Sign In** button

5. Click it and follow Google's authentication flow

## What This Enables

✅ Users can login with Google accounts
✅ All data is stored in Supabase PostgreSQL
✅ Secure session management with NextAuth
✅ Multiple users from same Google account handling
✅ Production-ready authentication

## Verification

Check if it's working:
- [ ] Supabase project created
- [ ] Database connected
- [ ] Google OAuth credentials obtained
- [ ] Environment variables updated
- [ ] Database migrated
- [ ] Dev server runs without errors
- [ ] Can login with Google account
- [ ] User data appears in Supabase

## Troubleshooting

**Issue**: Database connection refused
- Solution: Check connection string, verify Supabase IP whitelist

**Issue**: Google redirect error
- Solution: Verify redirect URIs match exactly in Google Console

**Issue**: NextAuth session error
- Solution: Generate new NEXTAUTH_SECRET, clear cookies

**Issue**: Prisma migration error
- Solution: Run `npx prisma migrate reset` to start fresh

