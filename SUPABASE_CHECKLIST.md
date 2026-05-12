# Supabase Connection Checklist

## ✅ What's Been Done For You

- [x] Updated Prisma schema from SQLite to PostgreSQL
- [x] Created comprehensive setup guides
- [x] Created setup scripts (Bash & Batch for Windows)
- [x] Created database schema documentation
- [x] All 18 tables documented and ready

## 📝 Your Action Items

### Phase 1: Create Supabase Project (5 minutes)

- [ ] Go to https://supabase.com
- [ ] Sign up or log in
- [ ] Click "New Project"
- [ ] **Project Name**: `tzu-chi-malawi`
- [ ] **Create a strong database password** (save it!)
- [ ] **Select region** closest to you
- [ ] Click "Create new project"
- [ ] **⏳ Wait 2-3 minutes** for initialization

### Phase 2: Get Connection String (2 minutes)

- [ ] In Supabase dashboard, go to **Settings**
- [ ] Click **Database**
- [ ] Find **Connection String** section
- [ ] Click on **"Connection pooler"**
- [ ] Change to **"Session"** mode
- [ ] Select **"URI"** tab
- [ ] **Copy** the connection string
- [ ] **Verify it contains**: `postgresql://postgres.YOUR_PROJECT:`

### Phase 3: Update Your Environment (2 minutes)

- [ ] Open `.env` file in your project
- [ ] Find the line: `DATABASE_URL=`
- [ ] Replace the entire value with your Supabase connection string
- [ ] Replace `[YOUR-PASSWORD]` with your database password
- [ ] **Save the file**
- [ ] **DO NOT commit to Git** - it contains secrets!

### Phase 4: Deploy to Supabase (5 minutes)

Open your terminal and run these commands:

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client for PostgreSQL
npx prisma generate

# 3. Create all tables in Supabase
npx prisma db push

# 4. Start your application
npm run dev
```

Expected output for step 3:
```
✓ Database synced, 18 new models added
```

### Phase 5: Verify Connection (3 minutes)

- [ ] Visit `http://localhost:3000` in your browser
- [ ] The website loads without errors
- [ ] Create a test account and log in
- [ ] Data saves successfully

**Verify in Supabase**:
1. Go to Supabase dashboard
2. Click **SQL Editor**
3. Run: `SELECT * FROM "User" LIMIT 5;`
4. You should see your test account!

---

## 📁 Files Created For You

| File | Purpose |
|------|---------|
| `SUPABASE_SETUP.md` | Quick setup guide |
| `SUPABASE_MIGRATION.md` | Detailed setup instructions |
| `DATABASE_SCHEMA.md` | Complete table documentation |
| `setup-supabase.sh` | Linux/Mac setup script |
| `setup-supabase.bat` | Windows setup script |
| `prisma/schema.prisma` | **UPDATED** to PostgreSQL |

---

## 🆘 Troubleshooting

### Error: "Can't reach database server"
```
✓ Check internet connection
✓ Verify password in .env matches Supabase
✓ Check Supabase project is running
✓ Try waiting longer (project initialization takes 2-3 min)
```

### Error: "relation \"User\" does not exist"
```bash
# Run again:
npx prisma db push
```

### Connection successful but data doesn't save
```bash
# Restart everything:
rm -rf .next
npx prisma generate
npm run dev
```

### Password authentication failed
1. Check your password is correct in Supabase dashboard
2. Make sure you replaced `[YOUR-PASSWORD]` with actual password
3. No special characters need escaping in the connection string

---

## 🔑 Important Notes

### Security
- **Never commit `.env` to GitHub** - add to `.gitignore` (already done)
- **Keep DATABASE_URL secret** - it contains your password
- Change `NEXTAUTH_SECRET` in production
- Change `JWT_SECRET` in production

### Performance
- PostgreSQL is much faster than SQLite
- Your app will handle more users
- Queries will be optimized by Supabase

### Data
- Your old SQLite data (if any) will NOT be automatically transferred
- This is a fresh database
- You'll start with zero records

### No Code Changes Needed
- Your React components stay the same
- Your API routes stay the same
- Prisma handles everything!

---

## 📊 Timeline

| Phase | Time | Status |
|-------|------|--------|
| Create Supabase | 5 min | ⭕ Waiting for you |
| Get connection | 2 min | ⭕ Waiting for you |
| Update .env | 2 min | ⭕ Waiting for you |
| Run migration | 5 min | ⭕ Waiting for you |
| Verify & test | 3 min | ⭕ Waiting for you |
| **Total** | **~15 min** | ✅ You ready? |

---

## 📞 Next Steps

1. **Start** with Phase 1 above
2. When done, run the commands in Phase 4
3. If you hit any errors, refer to Troubleshooting
4. Once working, your app is on enterprise production DB! 🚀

---

**Ready? Go to https://supabase.com and create your project!**

After setup, your website will be lightning fast and capable of handling thousands of users!
