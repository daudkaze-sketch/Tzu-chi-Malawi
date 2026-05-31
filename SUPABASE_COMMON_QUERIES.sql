-- Tzu Chi Malawi - Common SQL Queries Reference Guide

-- ============================================================
-- USER & AUTHENTICATION QUERIES
-- ============================================================

-- Get all active staff members
SELECT id, name, email, department, role, "createdAt"
FROM "User"
WHERE status = 'active'
ORDER BY name;

-- Find users by department
SELECT id, name, email, role
FROM "User"
WHERE department = 'Health' AND status = 'active'
ORDER BY name;

-- Get user activity summary
SELECT 
  u.name,
  COUNT(DISTINCT dr.id) as daily_reports,
  COUNT(DISTINCT t.id) as tasks_assigned,
  COUNT(DISTINCT hv.id) as home_visits
FROM "User" u
LEFT JOIN "DailyReport" dr ON u.id = dr."userId"
LEFT JOIN "Task" t ON u.id = t."userId"
LEFT JOIN "HomeVisit" hv ON u.id = hv."userId"
WHERE u.status = 'active'
GROUP BY u.id, u.name
ORDER BY daily_reports DESC;

-- ============================================================
-- DAILY REPORT QUERIES
-- ============================================================

-- Get recent daily reports
SELECT 
  date, 
  department, 
  workDone, 
  location,
  status
FROM "DailyReport"
ORDER BY date DESC
LIMIT 20;

-- Get daily reports by date range
SELECT 
  DATE(date) as report_date,
  department,
  COUNT(*) as total_reports,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
FROM "DailyReport"
WHERE date BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY DATE(date), department
ORDER BY report_date;

-- Get incomplete daily reports
SELECT 
  id, 
  date, 
  department, 
  workDone, 
  challenges
FROM "DailyReport"
WHERE status = 'in-progress'
ORDER BY date DESC;

-- ============================================================
-- ATTENDANCE QUERIES
-- ============================================================

-- Today's attendance status
SELECT 
  name,
  department,
  "checkInTime",
  "checkOutTime",
  status
FROM "Attendance"
WHERE DATE("checkInTime") = CURRENT_DATE
ORDER BY "checkInTime";

-- Monthly attendance report
SELECT 
  DATE("checkInTime") as date,
  COUNT(*) as total_staff,
  COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
  COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent,
  COUNT(CASE WHEN status = 'late' THEN 1 END) as late
FROM "Attendance"
WHERE "checkInTime" >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY DATE("checkInTime")
ORDER BY date;

-- Staff members with poor attendance
SELECT 
  name,
  department,
  COUNT(*) as total_records,
  COUNT(CASE WHEN status = 'absent' THEN 1 END) as absences
FROM "Attendance"
WHERE "checkInTime" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY name, department
HAVING COUNT(CASE WHEN status = 'absent' THEN 1 END) > 3
ORDER BY absences DESC;

-- ============================================================
-- TASK MANAGEMENT QUERIES
-- ============================================================

-- All pending tasks
SELECT 
  title,
  "assignedTo",
  department,
  priority,
  "startDate",
  "endDate"
FROM "Task"
WHERE status = 'pending'
ORDER BY priority DESC, "endDate";

-- Overdue tasks
SELECT 
  title,
  "assignedTo",
  department,
  "endDate",
  CURRENT_DATE - "endDate" as days_overdue
FROM "Task"
WHERE status != 'completed' 
  AND "endDate" < CURRENT_DATE
ORDER BY "endDate" DESC;

-- Task completion rate by department
SELECT 
  department,
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  ROUND(100.0 * COUNT(CASE WHEN status = 'completed' THEN 1 END) / COUNT(*), 2) as completion_rate
FROM "Task"
WHERE "startDate" >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY department
ORDER BY completion_rate DESC;

-- ============================================================
-- INVENTORY MANAGEMENT QUERIES
-- ============================================================

-- Low stock items
SELECT 
  "itemName",
  category,
  "quantityRemaining",
  "stockStatus",
  "storageLocation"
FROM "Material"
WHERE "stockStatus" IN ('Low Stock', 'Out of Stock')
ORDER BY category, "itemName";

-- Inventory usage report
SELECT 
  category,
  COUNT(*) as total_items,
  SUM("quantityReceived") as total_received,
  SUM("quantityUsed") as total_used,
  SUM("quantityRemaining") as total_remaining
FROM "Material"
WHERE "dateReceived" >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY category;

-- Items by storage location
SELECT 
  "storageLocation",
  COUNT(*) as item_count,
  SUM("quantityRemaining") as total_quantity
FROM "Material"
WHERE "quantityRemaining" > 0
GROUP BY "storageLocation"
ORDER BY total_quantity DESC;

-- ============================================================
-- TEACHING & EDUCATION QUERIES
-- ============================================================

-- Teaching activity summary
SELECT 
  type,
  location,
  COUNT(*) as sessions,
  SUM(participants) as total_participants,
  AVG(participants) as avg_participants
FROM "TeachingActivity"
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY type, location;

-- High-impact teaching activities (most participants)
SELECT 
  type,
  location,
  COUNT(*) as sessions,
  SUM(participants) as total_participants,
  ROUND(AVG(participants), 1) as avg_per_session
FROM "TeachingActivity"
GROUP BY type, location
ORDER BY total_participants DESC
LIMIT 10;

-- ============================================================
-- PRESCHOOL MONITORING QUERIES
-- ============================================================

-- School monitoring status
SELECT 
  "schoolName",
  location,
  "numberOfChildren",
  "numberOfTeachers",
  "cleanlinessLevel",
  "teachingQuality",
  "nutritionStatus"
FROM "PreSchoolMonitoring"
ORDER BY "schoolName";

-- Schools needing support
SELECT 
  "schoolName",
  location,
  "supportNeeded",
  "challenges"
FROM "PreSchoolMonitoring"
WHERE "supportNeeded" IS NOT NULL
ORDER BY "schoolName";

-- ============================================================
-- SCHOLARSHIP STUDENT QUERIES
-- ============================================================

-- Student performance overview
SELECT 
  "studentName",
  school,
  grade,
  "academicPerformance",
  attendance,
  behavior
FROM "ScholarshipStudent"
ORDER BY school, grade, "studentName";

-- Students at risk (poor performance/attendance)
SELECT 
  "studentName",
  school,
  grade,
  "academicPerformance",
  attendance,
  challenges
FROM "ScholarshipStudent"
WHERE "academicPerformance" IN ('Poor', 'Failing')
   OR attendance < 75
ORDER BY school;

-- Scholarship program statistics
SELECT 
  school,
  COUNT(*) as student_count,
  COUNT(CASE WHEN "academicPerformance" = 'Excellent' THEN 1 END) as excellent,
  COUNT(CASE WHEN "academicPerformance" = 'Good' THEN 1 END) as good,
  COUNT(CASE WHEN "academicPerformance" IN ('Poor', 'Failing') THEN 1 END) as at_risk
FROM "ScholarshipStudent"
GROUP BY school
ORDER BY student_count DESC;

-- ============================================================
-- AGRICULTURAL PROJECT QUERIES
-- ============================================================

-- Active agricultural projects
SELECT 
  "typeOfProject",
  "landSize",
  "projectStatus",
  COUNT(*) as beneficiary_count
FROM "AgriculturalProject" ap
LEFT JOIN "Beneficiary" b ON ap.id = b."projectId"
WHERE "projectStatus" != 'completed'
GROUP BY ap.id, "typeOfProject", "landSize", "projectStatus"
ORDER BY "typeOfProject";

-- Project yield analysis
SELECT 
  "typeOfProject",
  COUNT(*) as project_count,
  AVG(CAST("expectedYield" AS DECIMAL)) as avg_expected,
  AVG(CAST("actualYield" AS DECIMAL)) as avg_actual
FROM "AgriculturalProject"
WHERE "actualYield" IS NOT NULL
GROUP BY "typeOfProject";

-- Beneficiaries by project
SELECT 
  ap."typeOfProject",
  COUNT(b.id) as beneficiary_count,
  COUNT(DISTINCT b.location) as locations
FROM "AgriculturalProject" ap
LEFT JOIN "Beneficiary" b ON ap.id = b."projectId"
GROUP BY ap.id, ap."typeOfProject"
ORDER BY beneficiary_count DESC;

-- ============================================================
-- HOME VISIT QUERIES
-- ============================================================

-- Pending follow-up home visits
SELECT 
  "beneficiaryName",
  "familySize",
  "mainChallenges",
  "followUpDate"
FROM "HomeVisit"
WHERE "followUpDate" IS NOT NULL
  AND "followUpDate" <= CURRENT_DATE
ORDER BY "followUpDate";

-- Family needs analysis
SELECT 
  "immediateNeeds",
  COUNT(*) as frequency
FROM "HomeVisit"
WHERE "immediateNeeds" IS NOT NULL
GROUP BY "immediateNeeds"
ORDER BY frequency DESC;

-- ============================================================
-- RELIEF DISTRIBUTION QUERIES
-- ============================================================

-- Recent relief distributions
SELECT 
  date,
  "beneficiaryName",
  "itemsReceived",
  quantity,
  "villageName",
  district
FROM "ReliefDistribution"
ORDER BY date DESC
LIMIT 30;

-- Relief distribution by district
SELECT 
  district,
  COUNT(*) as distributions,
  SUM(quantity) as total_items,
  COUNT(DISTINCT "beneficiaryName") as beneficiaries
FROM "ReliefDistribution"
WHERE date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY district
ORDER BY total_items DESC;

-- Items most frequently distributed
SELECT 
  "itemsReceived",
  COUNT(*) as frequency,
  SUM(quantity) as total_distributed
FROM "ReliefDistribution"
GROUP BY "itemsReceived"
ORDER BY frequency DESC
LIMIT 15;

-- Follow-up required
SELECT 
  "beneficiaryName",
  date,
  "itemsReceived",
  quantity,
  "villageName"
FROM "ReliefDistribution"
WHERE "followUpNeeded" = true
ORDER BY date DESC;

-- ============================================================
-- MEDIA & DOCUMENTATION QUERIES
-- ============================================================

-- Media by department
SELECT 
  department,
  type,
  COUNT(*) as count
FROM "Media"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY department, type
ORDER BY department, count DESC;

-- Pending approvals
SELECT 
  id,
  title,
  department,
  type,
  photographer,
  "createdAt"
FROM "Media"
WHERE "approvalStatus" = 'Pending'
ORDER BY "createdAt" DESC;

-- ============================================================
-- ANNOUNCEMENTS QUERIES
-- ============================================================

-- Recent announcements by priority
SELECT 
  date,
  title,
  type,
  "priorityLevel",
  "messageContent"
FROM "Announcement"
ORDER BY date DESC, "priorityLevel" DESC
LIMIT 20;

-- High priority messages
SELECT 
  date,
  title,
  "messageContent",
  "attachments"
FROM "Announcement"
WHERE "priorityLevel" = 'High'
  AND date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;

-- ============================================================
-- SURVEY & DISASTER ASSESSMENT QUERIES
-- ============================================================

-- Disaster survey summary
SELECT 
  "typeOfDisaster",
  COUNT(*) as surveys,
  SUM("numberOfHouseholdsAffected") as total_households,
  SUM("numberOfInjured") as total_injured,
  COUNT(DISTINCT "areaAffected") as areas_affected
FROM "Survey"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY "typeOfDisaster"
ORDER BY surveys DESC;

-- Recent disaster surveys
SELECT 
  "areaAffected",
  "typeOfDisaster",
  "numberOfHouseholdsAffected",
  "numberOfInjured",
  "urgentNeeds",
  "createdAt"
FROM "Survey"
ORDER BY "createdAt" DESC
LIMIT 20;

-- ============================================================
-- GEOGRAPHIC QUERIES
-- ============================================================

-- Villages and volunteer count
SELECT 
  name,
  district,
  "activeVolunteers"
FROM "Village"
ORDER BY district, name;

-- Districts with most activity
SELECT 
  district,
  COUNT(DISTINCT id) as villages
FROM "Village"
GROUP BY district
ORDER BY villages DESC;

-- ============================================================
-- CROSS-TABLE ANALYTICS
-- ============================================================

-- User comprehensive activity report
SELECT 
  u.name,
  u.department,
  COUNT(DISTINCT dr.id) as daily_reports,
  COUNT(DISTINCT t.id) as tasks_created,
  COUNT(DISTINCT m.id) as materials_received,
  COUNT(DISTINCT ta.id) as teaching_sessions,
  COUNT(DISTINCT hv.id) as home_visits,
  COUNT(DISTINCT rd.id) as distributions
FROM "User" u
LEFT JOIN "DailyReport" dr ON u.id = dr."userId"
LEFT JOIN "Task" t ON u.id = t."userId"
LEFT JOIN "Material" m ON u.id = m."userId"
LEFT JOIN "TeachingActivity" ta ON u.id = ta."userId"
LEFT JOIN "HomeVisit" hv ON u.id = hv."userId"
LEFT JOIN "ReliefDistribution" rd ON u.id = rd."userId"
WHERE u.status = 'active'
  AND (dr."createdAt" >= CURRENT_DATE - INTERVAL '30 days' 
    OR t."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
    OR m."createdAt" >= CURRENT_DATE - INTERVAL '30 days')
GROUP BY u.id, u.name, u.department
ORDER BY daily_reports DESC;

-- Department activity dashboard
SELECT 
  u.department,
  COUNT(DISTINCT u.id) as staff_count,
  COUNT(DISTINCT dr.id) as daily_reports_month,
  COUNT(DISTINCT t.id) as tasks_month,
  COUNT(DISTINCT ta.id) as teachings_month,
  SUM(m."quantityRemaining") as current_inventory
FROM "User" u
LEFT JOIN "DailyReport" dr ON u.id = dr."userId" 
  AND dr."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN "Task" t ON u.id = t."userId" 
  AND t."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN "TeachingActivity" ta ON u.id = ta."userId"
  AND ta."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN "Material" m ON u.id = m."userId"
WHERE u.status = 'active'
GROUP BY u.department
ORDER BY staff_count DESC;

-- ============================================================
-- DATA CLEANUP & MAINTENANCE QUERIES
-- ============================================================

-- Find duplicate emails
SELECT email, COUNT(*) as count
FROM "User"
GROUP BY email
HAVING COUNT(*) > 1;

-- Find records with missing required fields
SELECT 'User' as table_name, COUNT(*) as missing_emails
FROM "User" WHERE email IS NULL
UNION ALL
SELECT 'DailyReport', COUNT(*)
FROM "DailyReport" WHERE "workDone" IS NULL
UNION ALL
SELECT 'Task', COUNT(*)
FROM "Task" WHERE title IS NULL;

-- Archive old completed tasks
SELECT COUNT(*) as tasks_to_archive
FROM "Task"
WHERE status = 'completed'
  AND "updatedAt" < CURRENT_DATE - INTERVAL '1 year';

-- ============================================================
-- PERFORMANCE MONITORING QUERIES
-- ============================================================

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check for missing indexes
SELECT 
  schemaname, 
  tablename, 
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================
-- NOTES FOR DEVELOPERS
-- ============================================================
-- 1. Always use parameterized queries to prevent SQL injection
-- 2. Index queries on frequently filtered columns (userId, date, status)
-- 3. Use LIMIT to prevent fetching too many records
-- 4. Consider pagination for large result sets
-- 5. Archive old data periodically for better performance
-- 6. Monitor slow queries using Supabase dashboard
-- 7. Use prepared statements for repeated queries
-- 8. Consider materialized views for complex reports
