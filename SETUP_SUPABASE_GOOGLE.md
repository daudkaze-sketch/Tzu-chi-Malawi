# ⚡ Quick Setup - Supabase + Google OAuth

## 🚀 What I've Done

✅ Updated Prisma to use PostgreSQL  
✅ Added NextAuth.js configuration  
✅ Updated login/register pages with Google Sign In buttons  
✅ Created NextAuth API route  
✅ Updated database schema for session management  

## 📋 What You Need To Do - FOLLOW THIS EXACTLY

### Step 1: Create Supabase Account (2 minutes)

1. Go to https://supabase.com
2. Click **"Sign Up"** (or login if you have account)
3. Click **"New Project"**
4. Fill in:
   - **Name**: ` `
   - **Password**: `YourStrongPassword123!` (save this!)
   - **Region**: Pick closest to your location
5. Click **Create new project**
6. **Wait 2-3 minutes** until it's ready (you'll see a green checkmark)

### Step 2: Get Database Connection String

1. In Supabase dashboard, go to **Settings** (bottom left)
2. Click **Database**
3. Scroll down to **Connection string**
4. Click on the **URI** tab
5. Copy the full URL
6. Replace `[YOUR-PASSWORD]` with your password from Step 1

Example URL:
```
postgresql://postgres:YourStrongPassword123!@db.xyzabc123.supabase.co:5432/postgres?schema=public
```

### Step 3: Get Google OAuth Credentials (3 minutes)

1. Go to https://console.cloud.google.com
2. Click **Create new project**
3. Name it: `Tzu Chi Malawi`
4. Wait for it to load
5. In top menu, go to **APIs & Services** → **Credentials**
6. Click **Create Credentials** → **OAuth client ID**
7. If asked, first click **Configure OAuth Consent Screen**
   - External user type
   - Fill required fields
   - Save and Continue
8. Back to Credentials, click **Create Credentials** → **OAuth client ID**
9. Choose **Web application**
10. Under **Authorized redirect URIs**, add:
    ```
    http://localhost:3000/api/auth/callback/google
    ```
11. Click **Create**
12. Copy your:
    - **Client ID**: `xxxxx.apps.googleusercontent.com`
    - **Client Secret**: `xxxxx`

### Step 4: Update Environment Variables

1. Open `.env` file in VS Code
2. Replace with your actual values:

```bash
# From Supabase (Step 2)
DATABASE_URL="postgresql://postgres:YourStrongPassword123!@db.xyzabc123.supabase.co:5432/postgres?schema=public"

# Generate a random secret - use ANY of these:
# Option A: Run in terminal:
#   openssl rand -base64 32
# Option B: Just use this (good for dev):
#   mNpEJ7X2zK9Lq4Wvs8M2bY5tH3fG6jR1xC9aL7nK2pQ5
NEXTAUTH_SECRET="mNpEJ7X2zK9Lq4Wvs8M2bY5tH3fG6jR1xC9aL7nK2pQ5"

NEXTAUTH_URL="http://localhost:3000"

# From Google (Step 3)
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"

JWT_SECRET="your-jwt-secret-change-in-production"
```

### Step 5: Setup Database

Run these commands in terminal:

```bash
# Install any new dependencies
npm install

# Create database tables
npx prisma migrate deploy

# Or reset database (deletes all data):
npx prisma migrate reset
```

### Step 6: Start the App

```bash
npm run dev
```

Visit: http://localhost:3000

### Step 7: Test It!

1. Click **"Login"**
2. You should see **"Sign in with Google"** button
3. Click it and follow Google's login
4. OR use email/password registration
5. Should redirect to dashboard

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database URL copied to `.env`
- [ ] Google credentials obtained
- [ ] `.env` file updated with all values
- [ ] Ran `npm install`
- [ ] Ran `npx prisma migrate deploy`
- [ ] Dev server running (`npm run dev`)
- [ ] Can see Google Sign In button
- [ ] Can login with Google
- [ ] Can register with email/password
- [ ] Redirects to dashboard after login

## 🔗 Connecting Old Accounts

Your existing local SQLite accounts are in the old database. To use them with Supabase:

**Option 1: Manual Re-registration (Easiest)**
- Just register new accounts in the system
- All new data will go to Supabase PostgreSQL

**Option 2: Migrate Old Data (Advanced)**
- Contact support for data migration script
- Or use Prisma migration tools

## 📝 File Changes Summary

```
✅ prisma/schema.prisma → Updated to PostgreSQL + NextAuth models
✅ src/lib/auth-options.ts → Created NextAuth configuration
✅ src/app/api/auth/[...nextauth]/route.ts → Created NextAuth API route
✅ src/app/login/page.tsx → Added Google Sign In button
✅ src/app/register/page.tsx → Added Google Sign Up button
✅ .env → Updated with Supabase & Google credentials
```

## 🚨 Troubleshooting

**Database connection error:**
- Check DATABASE_URL format is correct
- Verify Supabase project is active
- Wait 5 minutes for Supabase to fully initialize

**Google sign in not working:**
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Check redirect URI matches exactly
- Clear browser cookies

**NextAuth error:**
- Generate new NEXTAUTH_SECRET
- Delete `.next` folder
- Run `npm run dev` again

**Can't connect to Supabase:**
- Check your internet connection
- Verify Supabase status: supabase.com/status
- Try restarting dev server

## 📱 Next Steps After Setup

1. **Production Deployment:**
   - Deploy to Vercel, Railway, or Heroku
   - Update NEXTAUTH_URL and Google redirect URIs
   - Add backup strategy in Supabase

2. **Customize:**
   - Add your logo/branding
   - Set up email notifications
   - Configure backup policies

3. **Security:**
   - Enable Row Level Security in Supabase
   - Set up API keys properly
   - Regular backups

## 💬 Need Help?

- Supabase Docs: https://supabase.com/docs
- NextAuth Docs: https://next-auth.js.org
- Google OAuth: https://developers.google.com/identity/protocols/oauth2

---

**Questions?** Check the setup guide above or re-read each step carefully.

**Ready?** Follow the steps above and you'll have working Supabase + Google OAuth in 10-15 minutes!

