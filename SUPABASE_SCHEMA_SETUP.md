# Supabase SQL Schema Setup Guide

## Overview

This guide walks you through setting up all necessary tables in Supabase for the Tzu Chi Malawi office digitalization project.

The `supabase-schema.sql` file contains complete SQL scripts for:
- **18 Database Tables**
- **All Foreign Key Relationships**
- **Indexes for Performance**
- **Helper Views for Common Queries**

## Prerequisites

1. Supabase account (free at supabase.com)
2. Supabase project created
3. Access to the Supabase SQL Editor

## Step-by-Step Setup

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy and Paste the Schema SQL

1. Open `supabase-schema.sql` from the project root
2. Copy all the SQL content
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press `Ctrl+Enter`)

**⚠️ Important:** If you get an error about tables already existing, it's safe to ignore. The schema uses `IF NOT EXISTS` to handle existing tables.

### Step 3: Verify Table Creation

After running the SQL, verify all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see 18 tables:
- User
- DailyReport
- Attendance
- Task
- Material
- TeachingActivity
- PreSchoolMonitoring
- ScholarshipStudent
- OfficeTraining
- AgriculturalProject
- Beneficiary
- HomeVisit
- ReliefDistribution
- Survey
- CharityActivity
- Media
- Announcement
- Village

### Step 4: Check Foreign Key Relationships

Run this to verify relationships are set up correctly:

```sql
SELECT 
  constraint_name,
  table_name,
  column_name,
  referenced_table_name,
  referenced_column_name
FROM information_schema.referential_constraints
WHERE table_schema = 'public';
```

## Table Descriptions

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **User** | Staff authentication & management | id, email, name, role, department |
| **DailyReport** | Activity logging system | date, workDone, department, location |
| **Attendance** | Staff presence tracking | checkInTime, checkOutTime, status |
| **Task** | Task & project management | title, assignedTo, priority, status |

### Resource Management

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **Material** | Inventory & stock tracking | itemName, category, quantity*, stockStatus |
| **Media** | Photos, videos, documents | title, type, filePath, approvalStatus |
| **Announcement** | Office communications | title, messageContent, priorityLevel |

### Programs & Activities

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **TeachingActivity** | Dharma teaching logs | type, location, participants, topicsCovered |
| **OfficeTraining** | Staff training records | trainingTitle, date, objectives, participants |
| **CharityActivity** | Community service events | activityType, description, date, location |
| **PreSchoolMonitoring** | School monitoring | schoolName, cleanlinessLevel, teachingQuality |

### Community Support

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **ScholarshipStudent** | Student support tracking | studentName, school, grade, academicPerformance |
| **HomeVisit** | Family visit records | beneficiaryName, livingConditions, mainChallenges |
| **ReliefDistribution** | Aid distribution tracking | beneficiaryName, itemsReceived, quantity |
| **AgriculturalProject** | Farming initiatives | typeOfProject, landSize, projectStatus |
| **Beneficiary** | Project beneficiaries | name, projectId, typeOfSupport |

### Reference & Assessment

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **Village** | Geographic reference | name, district, activeVolunteers |
| **Survey** | Disaster assessments | areaAffected, typeOfDisaster, numberOfHouseholdsAffected |

## Indexes Created

The schema automatically creates indexes for optimal query performance:

- **Composite Indexes**: `userId` + status/date combinations for faster filtering
- **Foreign Key Indexes**: On all relationship fields
- **Date Indexes**: For time-based queries
- **Full-Text Indexes**: For text searching in work descriptions and announcements
- **Department Indexes**: For department-based filtering

## Views Available

The schema creates 5 helpful views for common queries:

### 1. `active_users`
Shows all currently active staff members:
```sql
SELECT * FROM active_users;
```

### 2. `attendance_summary`
Daily attendance statistics by department:
```sql
SELECT * FROM attendance_summary WHERE date = '2024-01-15';
```

### 3. `inventory_status`
Current inventory levels by category:
```sql
SELECT * FROM inventory_status;
```

### 4. `daily_report_summary`
Completion statistics for daily reports:
```sql
SELECT * FROM daily_report_summary WHERE report_date = '2024-01-15';
```

### 5. `project_summary`
Agricultural project overview with beneficiary counts:
```sql
SELECT * FROM project_summary;
```

## Integration with Prisma

Your project already has the Prisma schema configured. To sync with Supabase:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database (if not using raw SQL)
npx prisma db push
```

## Environment Variables

Update `.env` with your Supabase connection:

```bash
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="[generate-with-openssl-rand-base64-32]"
NEXTAUTH_URL="http://localhost:3000"

# JWT
JWT_SECRET="[generate-randomly]"
```

Get connection details from Supabase:
1. Dashboard → Settings → Database → Connection Strings
2. Select URI tab
3. Copy and paste, replacing `[PASSWORD]`

## Testing the Setup

### Test 1: Verify Connections
```sql
SELECT COUNT(*) as user_count FROM "User";
SELECT COUNT(*) as material_count FROM "Material";
```

### Test 2: Check Relationships
```sql
SELECT 
  u.name, 
  dr.workDone, 
  dr.date
FROM "User" u
LEFT JOIN "DailyReport" dr ON u.id = dr."userId"
LIMIT 10;
```

### Test 3: Test Cascading Deletes
```sql
-- Insert a test user
INSERT INTO "User" (id, email, name, role)
VALUES ('test-id', 'test@example.com', 'Test User', 'STAFF');

-- Insert related records
INSERT INTO "DailyReport" (id, date, department, "workDone", involved, location, "userId")
VALUES ('report-id', NOW(), 'General', 'Test work', 'Test', 'Office', 'test-id');

-- Delete the user (should cascade)
DELETE FROM "User" WHERE id = 'test-id';

-- Verify report was deleted too
SELECT * FROM "DailyReport" WHERE id = 'report-id'; -- Should be empty
```

## Troubleshooting

### Error: "Column already exists"
**Solution**: Run the query again - the schema uses `IF NOT EXISTS` to prevent errors

### Error: "Foreign key violation"
**Solution**: Ensure parent records exist before inserting child records

### Error: "Role does not exist"
**Solution**: 
```sql
-- Create role if needed
CREATE ROLE authenticated;
```

### Slow Queries
**Solution**: The schema includes indexes, but verify they're created:
```sql
SELECT * FROM pg_indexes WHERE tablename = 'DailyReport';
```

### Connection Timeout
**Solution**: 
1. Check your internet connection
2. Verify Supabase project is running
3. Double-check connection string password

## Backup & Recovery

### Export Schema
```bash
# From terminal (if using CLI)
supabase db dump > backup.sql
```

### Manual Backup Query
```sql
-- Get schema creation script
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

## Performance Tips

1. **Always index foreign keys** - Already done in schema
2. **Use composite indexes** - For common filter combinations
3. **Archive old data** - Move historical records to archive tables
4. **Monitor query performance** - Use Supabase Query Performance dashboard
5. **Use Row Security** - Set up RLS policies for multi-tenant access

## Next Steps

1. ✅ SQL schema created
2. ✅ Tables and relationships set up
3. Next: Configure Row Level Security (RLS) for data access control
4. Next: Set up authentication in the application
5. Next: Create backup policies

## Support Resources

- Supabase Docs: https://supabase.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Prisma Docs: https://www.prisma.io/docs/
- Project Repo: Check SUPABASE_SETUP.md for additional guides

## Additional Configuration

### Enable Row Level Security (RLS)

For security, enable RLS on sensitive tables:

```sql
-- Enable RLS on User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own record
CREATE POLICY "Users can view their own data"
ON "User"
FOR SELECT
USING (auth.uid()::text = id);

-- Similar policies for other tables...
```

### Set Up Backups

In Supabase Dashboard:
1. Go to Settings → Backups
2. Enable automated daily backups
3. Set retention period (minimum 7 days recommended)

### Configure Monitoring

1. Settings → Logs & Monitoring
2. Enable database logs
3. Set up alerts for:
   - High connection count
   - Slow queries
   - Authentication failures

---

**Last Updated**: January 2025
**Compatible With**: Supabase PostgreSQL, Next.js 15+, Prisma 5+
