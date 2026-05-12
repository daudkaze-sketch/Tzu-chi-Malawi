# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in the form:
   - **Name**: `tzu-chi-malawi`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose the closest to Malawi (e.g., `eu-west-1` for Europe)
4. Click **Create new project** and wait 2-3 minutes

## Step 2: Get Your Connection String

1. In Supabase dashboard, go to **Settings → Database**
2. Find the **Connection String** section
3. Click on the **"URI"** tab
4. Copy the connection string (it looks like: `postgresql://user:password@host:5432/postgres?schema=public`)
5. Replace `[YOUR-PASSWORD]` with your database password from Step 1

## Step 3: Update Environment Variables

Update your `.env` file:

```bash
# Database Configuration (Change from SQLite to PostgreSQL/Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres?schema=public"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# JWT Token Secret
JWT_SECRET="your-jwt-secret-change-in-production"
```

Replace:
- `[YOUR-PASSWORD]` with the password you created
- `[HOST]` with the host from your Supabase connection string

## Step 4: Update Prisma Schema

Already done! The `prisma/schema.prisma` file has been updated to use PostgreSQL instead of SQLite.

## Step 5: Install/Update Dependencies

Run:
```bash
npm install
npx prisma generate
```

## Step 6: Push Schema to Supabase

Run the migration command:
```bash
npx prisma db push
```

This will:
- Create all tables in Supabase
- Set up all relationships
- Create all indexes

## Step 7: Verify Connection

Start your development server:
```bash
npm run dev
```

Then test by:
1. Going to `http://localhost:3000/login`
2. Creating a new account
3. Logging in

Check the data is saved by:
1. Going to Supabase dashboard
2. Going to **SQL Editor**
3. Running: `SELECT * FROM "User";`

## Troubleshooting

### Connection Error: "Can't reach database server"
- Check your internet connection
- Verify the password is correct in the connection string
- Check if Supabase project is running (check dashboard)

### Error: "relation \"User\" does not exist"
- Run `npx prisma db push` again
- Check that all migrations completed successfully

### Prisma Generation Error
- Delete `node_modules/.prisma` folder
- Run `npx prisma generate` again

## Backup Your Data

Before starting, backup your SQLite database:
```bash
cp prisma/dev.db prisma/dev.db.backup
```

## Rolling Back (if needed)

To switch back to SQLite temporarily:
1. Restore the backup: `cp prisma/dev.db.backup prisma/dev.db`
2. Change DATABASE_URL back to: `file:./prisma/dev.db`
3. Run `npm run dev`
