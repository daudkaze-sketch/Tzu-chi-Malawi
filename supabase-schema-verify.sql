-- Supabase SQL Schema Execution Script
-- For the Tzu Chi Malawi Office Digitalization Project

-- ============================================================
-- EXECUTION INSTRUCTIONS
-- ============================================================
-- 
-- Option 1: Using Supabase Web Interface
-- 1. Go to your Supabase Project Dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy this entire file content
-- 5. Paste into the SQL editor
-- 6. Click "Run" button (or Ctrl+Enter)
-- 
-- Option 2: Using Supabase CLI
-- $ supabase db push < supabase-schema.sql
--
-- Option 3: Using psql (if you have PostgreSQL client)
-- $ psql -h [HOST] -U postgres -d postgres -f supabase-schema.sql
--
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET TIMEZONE = 'UTC';

-- ============================================================
-- EXECUTE SCHEMA CREATION
-- ============================================================
-- The main schema SQL is in supabase-schema.sql
-- This script provides setup verification steps

-- ============================================================
-- POST-EXECUTION VERIFICATION CHECKLIST
-- ============================================================

-- 1. VERIFY ALL TABLES CREATED
SELECT 
  COUNT(*) as total_tables,
  STRING_AGG(table_name, ', ' ORDER BY table_name) as table_list
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
GROUP BY table_schema;

-- Expected: 18 tables should be listed

-- 2. VERIFY FOREIGN KEY RELATIONSHIPS
SELECT
  con.conname,
  rel.relname,
  att.attname,
  fk.relname as references_table
FROM
  pg_class rel
  INNER JOIN pg_constraint con ON con.conrelid = rel.oid
  INNER JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = con.conkey[1]
  INNER JOIN pg_class fk ON fk.oid = con.confrelid
WHERE
  con.contype = 'f'
ORDER BY rel.relname;

-- Expected: Multiple foreign keys from various tables pointing to User table

-- 3. VERIFY INDEXES CREATED
SELECT 
  t.tablename,
  i.indexname,
  ix.indisunique,
  ix.indisprimary
FROM 
  pg_indexes i
  JOIN pg_class c ON c.relname = i.indexname
  JOIN pg_index ix ON ix.indexrelid = c.oid
  JOIN pg_class t ON t.oid = ix.indrelid
WHERE 
  i.schemaname = 'public'
ORDER BY t.tablename, i.indexname;

-- Expected: Multiple indexes for performance optimization

-- 4. VERIFY VIEWS CREATED
SELECT 
  view_name
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY view_name;

-- Expected: Should list views like active_users, attendance_summary, etc.

-- ============================================================
-- SAMPLE DATA INSERTION (OPTIONAL - for testing)
-- ============================================================
-- Uncomment the following to insert sample data for testing

/*
-- Insert test user
INSERT INTO "User" (id, name, email, username, department, role, status)
VALUES (
  'test-user-001',
  'John Doe',
  'john@example.com',
  'johndoe',
  'Administration',
  'STAFF',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample daily report
INSERT INTO "DailyReport" (id, date, department, "workDone", involved, location, status, "userId")
VALUES (
  'report-001',
  NOW(),
  'Administration',
  'Setup and configuration of office systems',
  'IT Team',
  'Office',
  'completed',
  'test-user-001'
) ON CONFLICT DO NOTHING;

-- Insert sample attendance
INSERT INTO "Attendance" (id, name, department, "checkInTime", status, "userId")
VALUES (
  'att-001',
  'John Doe',
  'Administration',
  NOW(),
  'present',
  'test-user-001'
) ON CONFLICT DO NOTHING;
*/

-- ============================================================
-- DATABASE CONFIGURATION & OPTIMIZATION
-- ============================================================

-- Enable UUID generation for new tables if needed
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;

-- Set statement timeout for safety (5 minutes)
SET statement_timeout = '5min';

-- ============================================================
-- INITIAL DATA FOR REFERENCE TABLES
-- ============================================================

-- Insert Malawi districts into Village table
INSERT INTO "Village" (id, name, district) VALUES
('v-001', 'Lilongwe City', 'Lilongwe'),
('v-002', 'Blantyre City', 'Blantyre'),
('v-003', 'Mzuzu City', 'Mzuzu'),
('v-004', 'Zomba City', 'Zomba')
ON CONFLICT DO NOTHING;

-- ============================================================
-- MIGRATION CHECKLIST
-- ============================================================
-- Run this to ensure everything is properly set up:
/*
[ ] 1. All 18 tables created successfully
[ ] 2. All foreign key relationships verified
[ ] 3. All indexes created for performance
[ ] 4. All views created successfully
[ ] 5. Environment variables updated with database connection
[ ] 6. Prisma client generated (npx prisma generate)
[ ] 7. Test insert/select operations working
[ ] 8. Verify cascading deletes work
[ ] 9. Test relationships are maintained
[ ] 10. Backup configured in Supabase dashboard
[ ] 11. RLS policies configured (if needed)
[ ] 12. Connection tested from application
*/

-- ============================================================
-- QUICK TEST QUERIES
-- ============================================================

-- Test 1: Check total records in each table
SELECT 
  'User' as table_name, 
  COUNT(*) as record_count 
FROM "User"
UNION ALL
SELECT 'DailyReport', COUNT(*) FROM "DailyReport"
UNION ALL
SELECT 'Attendance', COUNT(*) FROM "Attendance"
UNION ALL
SELECT 'Task', COUNT(*) FROM "Task"
UNION ALL
SELECT 'Material', COUNT(*) FROM "Material"
UNION ALL
SELECT 'TeachingActivity', COUNT(*) FROM "TeachingActivity"
UNION ALL
SELECT 'PreSchoolMonitoring', COUNT(*) FROM "PreSchoolMonitoring"
UNION ALL
SELECT 'ScholarshipStudent', COUNT(*) FROM "ScholarshipStudent"
UNION ALL
SELECT 'OfficeTraining', COUNT(*) FROM "OfficeTraining"
UNION ALL
SELECT 'AgriculturalProject', COUNT(*) FROM "AgriculturalProject"
UNION ALL
SELECT 'Beneficiary', COUNT(*) FROM "Beneficiary"
UNION ALL
SELECT 'HomeVisit', COUNT(*) FROM "HomeVisit"
UNION ALL
SELECT 'ReliefDistribution', COUNT(*) FROM "ReliefDistribution"
UNION ALL
SELECT 'Survey', COUNT(*) FROM "Survey"
UNION ALL
SELECT 'CharityActivity', COUNT(*) FROM "CharityActivity"
UNION ALL
SELECT 'Media', COUNT(*) FROM "Media"
UNION ALL
SELECT 'Announcement', COUNT(*) FROM "Announcement"
UNION ALL
SELECT 'Village', COUNT(*) FROM "Village"
ORDER BY table_name;

-- Test 2: Verify timestamp defaults
SELECT 
  '"createdAt" default' as field_info,
  column_default
FROM information_schema.columns
WHERE table_name = 'User' AND column_name = 'createdAt';

-- Test 3: Check constraints
SELECT 
  table_name,
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'User'
ORDER BY ordinal_position;

-- ============================================================
-- TROUBLESHOOTING QUERIES
-- ============================================================

-- If you get "table already exists" error:
-- The schema uses IF NOT EXISTS, so it's safe to rerun

-- If you get "foreign key constraint violation":
-- Check parent record exists before inserting related record

-- To see all errors/issues:
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%ERROR%'
LIMIT 10;

-- To check database size:
SELECT 
  pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE pg_database.datname = 'postgres';

-- ============================================================
-- FINAL VERIFICATION
-- ============================================================

-- Run this final query to confirm all tables exist and are accessible:
DO $$ 
DECLARE 
  expected_tables INT := 18;
  actual_tables INT;
BEGIN
  SELECT COUNT(*)::INT INTO actual_tables
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  
  IF actual_tables = expected_tables THEN
    RAISE NOTICE 'SUCCESS: All % tables created successfully!', expected_tables;
  ELSE
    RAISE NOTICE 'WARNING: Expected % tables but found %', expected_tables, actual_tables;
  END IF;
END $$;

-- ============================================================
-- SETUP COMPLETE
-- ============================================================
-- 
-- Your Supabase database is now ready for the Tzu Chi Malawi
-- office digitalization system!
-- 
-- Next steps:
-- 1. Update .env with database connection string
-- 2. Run: npx prisma generate
-- 3. Run: npm run dev
-- 4. Test login at http://localhost:3000
-- 
-- For more information, see:
-- - SUPABASE_SCHEMA_SETUP.md
-- - SUPABASE_COMMON_QUERIES.sql
-- - DATABASE_SCHEMA.md
--
-- ============================================================
