# Supabase Migration & Connection Guide

## 📋 Your Database Schema (Ready for Supabase)

Your application uses the following 15 tables:

### Core Models
- **User** - Staff members with roles (Admin, Staff, Volunteer)
- **Village** - Geographic divisions for operations

### Activity Tracking
- **DailyReport** - Daily activity logs by department
- **Attendance** - Staff check-in/check-out records
- **Task** - Department task assignments and tracking
- **CharityActivity** - Community service activities

### Education Department
- **TeachingActivity** - Dharma/training sessions
- **PreSchoolMonitoring** - School monitoring reports
- **ScholarshipStudent** - Student support tracking
- **OfficeTraining** - Staff training programs

### Agriculture Department
- **AgriculturalProject** - Crop/livestock projects
- **Beneficiary** - Project beneficiaries

### Community Support
- **HomeVisit** - Family assessment visits
- **ReliefDistribution** - Aid distribution tracking
- **Survey** - Disaster/need assessments

### Media & Communications
- **Media** - Photos and documents
- **Announcement** - Office announcements

### Inventory
- **Material** - Stock tracking (food/non-food items)

---

## 🚀 Quick Start (4 Steps)

### Step 1: Create Supabase Project
```
1. Visit https://supabase.com
2. Click "New Project"
3. Name: "tzu-chi-malawi"
4. Create strong password (save it!)
5. Select region (EU or Africa)
6. Wait 2-3 minutes for project creation
```

### Step 2: Get Connection String
```
1. In Supabase: Settings → Database
2. Find "Connection String" section
3. Select "URI" tab
4. Copy the full connection string
5. Replace [YOUR-PASSWORD] with your database password
```

### Step 3: Update .env File
Replace your current `.env` with:

```env
# Supabase Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres?schema=public"

# NextAuth (keep same as before)
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# JWT (keep same as before)
JWT_SECRET="your-jwt-secret-change-in-production"
```

**Where to find values in Supabase:**
- `[YOUR-PASSWORD]` = Database password from project creation
- `[YOUR-HOST]` = From connection string, looks like: `xyz123.supabase.co`

### Step 4: Deploy Schema to Supabase
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

---

## 📝 Detailed Setup Instructions

### Prerequisites
- Node.js installed (v18+)
- npm installed
- Supabase account (free tier is fine)

### Installation Steps

#### 1. Create Supabase Project
- Visit [supabase.com](https://supabase.com)
- Sign up or log in
- Click **"New Project"**
- Fill the form:
  - **Project Name**: `tzu-chi-malawi`
  - **Password**: Create a strong one (save it!)
  - **Region**: Choose closest to you (e.g., `eu-west-1`)
- Click **Create new project**
- **Wait 2-3 minutes** for the project to initialize

#### 2. Get Your Connection Details

Once your project is ready:

1. Go to **Settings** (bottom left)
2. Click **Database**
3. In **Connection String** section, click **"Connection pooler"**
4. Change the mode to **"Session"**
5. Select **"URI"** tab
6. Copy the entire string

Example format:
```
postgresql://postgres.xxxxxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public
```

#### 3. Update Your Environment File

Open `.env` in your project root and update `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-region-1.pooler.supabase.com:6543/postgres?schema=public"
```

Keep everything else the same:
```env
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-change-in-production"
```

#### 4. Install Dependencies & Generate Client

```bash
npm install
npx prisma generate
```

This generates the Prisma client for PostgreSQL.

#### 5. Backup Your Current Data (Optional but Recommended)

If you want to keep your SQLite data:
```bash
cp prisma/dev.db prisma/dev.db.backup
```

#### 6. Push Schema to Supabase

This creates all your tables in Supabase:

```bash
npx prisma db push
```

You'll see output like:
```
✓ Database synced, 15 new models added
```

#### 7. Start Your Application

```bash
npm run dev
```

Your app now uses Supabase!

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Connection string obtained from Supabase
- [ ] `.env` file updated with Supabase connection
- [ ] `npm install` completed successfully
- [ ] `npx prisma db push` shows "Database synced"
- [ ] `npm run dev` starts without errors
- [ ] Website loads at `http://localhost:3000`
- [ ] Can log in or create new account
- [ ] Data appears to save

### Verify Data in Supabase

To see if your data is actually in Supabase:

1. Go to your Supabase project dashboard
2. Click **"SQL Editor"**
3. Run this query:
   ```sql
   SELECT * FROM "User" LIMIT 10;
   ```
4. Click **"Run"** - you should see your users

---

## 🔧 Troubleshooting

### Problem: "Connection refused" or "Can't reach database server"

**Solution:**
- Check internet connection
- Verify password is correct in connection string
- Make sure Supabase project is running (check dashboard)
- Check region is correct in connection string

### Problem: "relation \"User\" does not exist"

**Solution:**
```bash
npx prisma db push
```

### Problem: Prisma client generation errors

**Solution:**
```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### Problem: Port 3000 already in use

**Solution:**
```bash
npm run dev -- -p 3001
```

Then visit `http://localhost:3001`

### Problem: Still getting SQLite errors

**Solution:**
1. Delete `.next` folder: `rm -rf .next`
2. Regenerate: `npx prisma generate`
3. Restart: `npm run dev`

---

## 📊 Database Tables Explained

### **User Table**
Stores staff information
```
- id, email, name, password, department, role, status
- Roles: Admin, Staff, Volunteer
- Departments: Education, Agriculture, Charity, etc.
```

### **DailyReport Table**
Logs daily activities
```
- date, department, workDone, involved, location
- challenges, solutions, images/photos
- Owner: User (staff member who created it)
```

### **Attendance Table**
Track staff presence
```
- checkInTime, checkOutTime, status
- department, remarks
- Owner: User
```

### **Task Table**
Project task management
```
- title, assignedTo, department, startDate, endDate
- priority (High, Medium, Low), status (pending, in-progress, completed)
- Owner: User
```

### **Material Table**
Inventory tracking
```
- itemName, category (Food/Non-Food)
- quantityReceived, quantityUsed, quantityRemaining
- stockStatus (In Stock, Low Stock, Out of Stock)
- storageLocation, dateReceived
```

### **TeachingActivity Table**
Education activities
```
- type (Dharma, Training, etc)
- location (Office, School, Home)
- participants, topicsCovered, ageGroup
- understandingLevel, feedback, challenges
```

(15 tables total - all documented in your Prisma schema)

---

## 🔒 Security Notes

### Passwords & Secrets
- **DATABASE_URL**: Keep secure, don't commit to GitHub
- **NEXTAUTH_SECRET**: Change in production
- **JWT_SECRET**: Change in production

### Supabase Security
- Enable Row Level Security (RLS) for production
- Create separate databases for dev/staging/production
- Use strong passwords
- Enable 2FA on your Supabase account

---

## 📈 Next Steps After Setup

1. **Migrate Your Data** (if you have existing SQLite data)
   ```bash
   # Export from SQLite, import to PostgreSQL
   ```

2. **Enable Backups** in Supabase dashboard

3. **Set Up Row Level Security (RLS)** for production security

4. **Test All Features**:
   - User authentication
   - Create daily reports
   - Add attendance records
   - Upload media
   - All CRUD operations

5. **Deploy to Production** (Vercel with Supabase)

---

## 🆘 Need Help?

If you encounter issues:

1. Check Supabase status: https://status.supabase.com
2. Review Prisma docs: https://www.prisma.io/docs
3. Check your `.env` file is correct
4. Verify Supabase project is running
5. Try restarting: `npm run dev`

---

## Files Modified

- ✅ `prisma/schema.prisma` - Changed from SQLite to PostgreSQL
- ✅ `.env` - Needs updating with Supabase connection string
- ✅ `SUPABASE_SETUP.md` - Created this guide

**No changes needed in your application code** - Prisma handles the database switchover!

---

**Good luck! Your Tzu Chi Malawi office system is moving to enterprise-grade infrastructure!** 🚀
