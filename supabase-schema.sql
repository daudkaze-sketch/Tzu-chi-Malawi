-- Tzu Chi Malawi Office - Supabase Database Schema
-- Complete SQL for all tables and relationships
-- Generated for PostgreSQL/Supabase

-- ============================================================
-- 1. USER TABLE (Authentication & Staff Management)
-- ============================================================
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  name TEXT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMP,
  image TEXT,
  password TEXT,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'STAFF',
  status TEXT NOT NULL DEFAULT 'active',
  provider TEXT NOT NULL DEFAULT 'local',
  "providerId" TEXT UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_username ON "User"(username);
CREATE INDEX idx_user_department ON "User"(department);
CREATE INDEX idx_user_role ON "User"(role);

-- ============================================================
-- 2. DAILY REPORT TABLE (Activity Logging)
-- ============================================================
CREATE TABLE IF NOT EXISTS "DailyReport" (
  id TEXT PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  department TEXT NOT NULL,
  "workDone" TEXT NOT NULL,
  involved TEXT NOT NULL,
  location TEXT NOT NULL,
  challenges TEXT,
  solutions TEXT,
  status TEXT NOT NULL DEFAULT 'in-progress',
  images TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_dailyreport_userid_date ON "DailyReport"("userId", date);
CREATE INDEX idx_dailyreport_date ON "DailyReport"(date);
CREATE INDEX idx_dailyreport_department ON "DailyReport"(department);

-- ============================================================
-- 3. ATTENDANCE TABLE (Staff Presence Tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Attendance" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  "checkInTime" TIMESTAMP NOT NULL,
  "checkOutTime" TIMESTAMP,
  status TEXT NOT NULL,
  remarks TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_attendance_userid ON "Attendance"("userId");
CREATE INDEX idx_attendance_date ON "Attendance"("checkInTime");
CREATE INDEX idx_attendance_department ON "Attendance"(department);

-- ============================================================
-- 4. TASK TABLE (Project & Task Management)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Task" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "assignedTo" TEXT NOT NULL,
  department TEXT NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  priority TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_task_userid_status ON "Task"("userId", status);
CREATE INDEX idx_task_status ON "Task"(status);
CREATE INDEX idx_task_priority ON "Task"(priority);
CREATE INDEX idx_task_startdate ON "Task"("startDate");

-- ============================================================
-- 5. MATERIAL TABLE (Inventory & Stock Tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Material" (
  id TEXT PRIMARY KEY,
  "itemName" TEXT NOT NULL,
  category TEXT NOT NULL,
  "quantityReceived" INTEGER NOT NULL DEFAULT 0,
  "quantityUsed" INTEGER NOT NULL DEFAULT 0,
  "quantityRemaining" INTEGER NOT NULL DEFAULT 0,
  "stockStatus" TEXT NOT NULL DEFAULT 'In Stock',
  "dateReceived" TIMESTAMP NOT NULL,
  "receivedFrom" TEXT,
  "issuedTo" TEXT,
  "purposeOfUse" TEXT,
  "storageLocation" TEXT,
  remarks TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_material_userid ON "Material"("userId");
CREATE INDEX idx_material_category ON "Material"(category);
CREATE INDEX idx_material_stockstatus ON "Material"("stockStatus");
CREATE INDEX idx_material_datereceived ON "Material"("dateReceived");

-- ============================================================
-- 6. TEACHING ACTIVITY TABLE (Education & Dharma Teaching)
-- ============================================================
CREATE TABLE IF NOT EXISTS "TeachingActivity" (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  participants INTEGER NOT NULL,
  "ageGroup" TEXT,
  "topicsCovered" TEXT NOT NULL,
  duration TEXT,
  "materialsUsed" TEXT,
  "understandingLevel" TEXT,
  feedback TEXT,
  challenges TEXT,
  "followUpPlan" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_teachingactivity_userid ON "TeachingActivity"("userId");
CREATE INDEX idx_teachingactivity_type ON "TeachingActivity"(type);
CREATE INDEX idx_teachingactivity_location ON "TeachingActivity"(location);

-- ============================================================
-- 7. PRESCHOOL MONITORING TABLE (School Monitoring & Assessment)
-- ============================================================
CREATE TABLE IF NOT EXISTS "PreSchoolMonitoring" (
  id TEXT PRIMARY KEY,
  "schoolName" TEXT NOT NULL,
  location TEXT NOT NULL,
  "numberOfChildren" INTEGER NOT NULL,
  "numberOfTeachers" INTEGER NOT NULL,
  "attendanceRate" TEXT NOT NULL,
  "cleanlinessLevel" TEXT NOT NULL,
  "teachingQuality" TEXT NOT NULL,
  "learningMaterialsAvailability" TEXT NOT NULL,
  "nutritionStatus" TEXT NOT NULL,
  challenges TEXT,
  "supportNeeded" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_preschoolmonitoring_userid ON "PreSchoolMonitoring"("userId");
CREATE INDEX idx_preschoolmonitoring_schoolname ON "PreSchoolMonitoring"("schoolName");
CREATE INDEX idx_preschoolmonitoring_location ON "PreSchoolMonitoring"(location);

-- ============================================================
-- 8. SCHOLARSHIP STUDENT TABLE (Student Support Tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS "ScholarshipStudent" (
  id TEXT PRIMARY KEY,
  "studentName" TEXT NOT NULL,
  school TEXT NOT NULL,
  grade TEXT NOT NULL,
  "academicPerformance" TEXT NOT NULL,
  attendance TEXT NOT NULL,
  behavior TEXT NOT NULL,
  "financialSupport" TEXT NOT NULL,
  "guardianDetails" TEXT NOT NULL,
  "progressReports" TEXT,
  challenges TEXT,
  recommendations TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_scholarshipstudent_userid ON "ScholarshipStudent"("userId");
CREATE INDEX idx_scholarshipstudent_schoolname ON "ScholarshipStudent"(school);
CREATE INDEX idx_scholarshipstudent_studentname ON "ScholarshipStudent"("studentName");

-- ============================================================
-- 9. OFFICE TRAINING TABLE (Staff Training & Development)
-- ============================================================
CREATE TABLE IF NOT EXISTS "OfficeTraining" (
  id TEXT PRIMARY KEY,
  "trainingTitle" TEXT NOT NULL,
  "trainerName" TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  duration TEXT NOT NULL,
  participants TEXT NOT NULL,
  objectives TEXT NOT NULL,
  "topicsCovered" TEXT NOT NULL,
  "skillsGained" TEXT,
  evaluation TEXT,
  feedback TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_officetraining_userid ON "OfficeTraining"("userId");
CREATE INDEX idx_officetraining_date ON "OfficeTraining"(date);
CREATE INDEX idx_officetraining_trainername ON "OfficeTraining"("trainerName");

-- ============================================================
-- 10. AGRICULTURAL PROJECT TABLE (Crop & Livestock Initiatives)
-- ============================================================
CREATE TABLE IF NOT EXISTS "AgriculturalProject" (
  id TEXT PRIMARY KEY,
  "typeOfProject" TEXT NOT NULL,
  "landSize" TEXT,
  "inputsProvided" TEXT,
  "farmingMethods" TEXT,
  "expectedYield" TEXT,
  "actualYield" TEXT,
  "weatherChallenges" TEXT,
  "projectStatus" TEXT NOT NULL DEFAULT 'not-started',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_agriculturalproject_userid ON "AgriculturalProject"("userId");
CREATE INDEX idx_agriculturalproject_type ON "AgriculturalProject"("typeOfProject");
CREATE INDEX idx_agriculturalproject_status ON "AgriculturalProject"("projectStatus");

-- ============================================================
-- 11. BENEFICIARY TABLE (Agricultural Project Beneficiaries)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Beneficiary" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  contact TEXT,
  "typeOfSupport" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "progressStatus" TEXT,
  notes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("projectId") REFERENCES "AgriculturalProject"(id) ON DELETE CASCADE
);

CREATE INDEX idx_beneficiary_projectid ON "Beneficiary"("projectId");
CREATE INDEX idx_beneficiary_name ON "Beneficiary"(name);
CREATE INDEX idx_beneficiary_location ON "Beneficiary"(location);

-- ============================================================
-- 12. HOME VISIT TABLE (Family Visit Records)
-- ============================================================
CREATE TABLE IF NOT EXISTS "HomeVisit" (
  id TEXT PRIMARY KEY,
  "beneficiaryName" TEXT NOT NULL,
  "familySize" INTEGER,
  "livingConditions" TEXT,
  "mainChallenges" TEXT,
  "healthCondition" TEXT,
  "incomeSource" TEXT,
  "immediateNeeds" TEXT,
  "longTermNeeds" TEXT,
  recommendations TEXT,
  "followUpDate" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_homevisit_userid ON "HomeVisit"("userId");
CREATE INDEX idx_homevisit_beneficiaryname ON "HomeVisit"("beneficiaryName");
CREATE INDEX idx_homevisit_followupdate ON "HomeVisit"("followUpDate");

-- ============================================================
-- 13. RELIEF DISTRIBUTION TABLE (Aid Tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS "ReliefDistribution" (
  id TEXT PRIMARY KEY,
  "beneficiaryName" TEXT NOT NULL,
  "beneficiaryId" TEXT,
  "itemsReceived" TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  signature TEXT,
  location TEXT NOT NULL,
  "villageName" TEXT NOT NULL,
  district TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  "distributionType" TEXT NOT NULL,
  purpose TEXT NOT NULL,
  "followUpNeeded" BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_relieffdistribution_userid ON "ReliefDistribution"("userId");
CREATE INDEX idx_relieffdistribution_date ON "ReliefDistribution"(date);
CREATE INDEX idx_relieffdistribution_village ON "ReliefDistribution"("villageName");
CREATE INDEX idx_relieffdistribution_district ON "ReliefDistribution"(district);
CREATE INDEX idx_relieffdistribution_beneficiaryname ON "ReliefDistribution"("beneficiaryName");

-- ============================================================
-- 14. SURVEY TABLE (Disaster & Needs Assessments)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Survey" (
  id TEXT PRIMARY KEY,
  "areaAffected" TEXT NOT NULL,
  "typeOfDisaster" TEXT NOT NULL,
  "numberOfHouseholdsAffected" INTEGER NOT NULL,
  "numberOfInjured" INTEGER,
  "urgentNeeds" TEXT,
  "accessibilityOfArea" TEXT,
  photos TEXT,
  "recommendedAction" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_survey_disaster ON "Survey"("typeOfDisaster");
CREATE INDEX idx_survey_date ON "Survey"("createdAt");

-- ============================================================
-- 15. CHARITY ACTIVITY TABLE (Community Service & Events)
-- ============================================================
CREATE TABLE IF NOT EXISTS "CharityActivity" (
  id TEXT PRIMARY KEY,
  "activityType" TEXT NOT NULL,
  description TEXT NOT NULL,
  participants TEXT,
  location TEXT,
  date TIMESTAMP NOT NULL,
  impact TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_charityactivity_userid ON "CharityActivity"("userId");
CREATE INDEX idx_charityactivity_type ON "CharityActivity"("activityType");
CREATE INDEX idx_charityactivity_date ON "CharityActivity"(date);

-- ============================================================
-- 16. MEDIA TABLE (Photos, Videos & Documents)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Media" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  department TEXT NOT NULL,
  "eventName" TEXT,
  photographer TEXT,
  location TEXT,
  date TIMESTAMP NOT NULL,
  description TEXT,
  "approvalStatus" TEXT NOT NULL DEFAULT 'Pending',
  "filePath" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_media_userid_department ON "Media"("userId", department);
CREATE INDEX idx_media_date ON "Media"(date);
CREATE INDEX idx_media_type ON "Media"(type);
CREATE INDEX idx_media_approvalstatus ON "Media"("approvalStatus");

-- ============================================================
-- 17. ANNOUNCEMENT TABLE (Office Notices & Communications)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Announcement" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  "messageContent" TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  "priorityLevel" TEXT NOT NULL,
  attachments TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_announcement_userid_date ON "Announcement"("userId", date);
CREATE INDEX idx_announcement_date ON "Announcement"(date);
CREATE INDEX idx_announcement_prioritylevel ON "Announcement"("priorityLevel");

-- ============================================================
-- 18. VILLAGE TABLE (Geographic Reference Data)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Village" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  "activeVolunteers" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_village_district ON "Village"(district);
CREATE INDEX idx_village_name ON "Village"(name);

-- ============================================================
-- Additional Indexes for Performance
-- ============================================================
-- Enable full-text search on important text fields
CREATE INDEX idx_dailyreport_workdone_search ON "DailyReport" USING GIN(to_tsvector('english', "workDone"));
CREATE INDEX idx_task_title_search ON "Task" USING GIN(to_tsvector('english', title));
CREATE INDEX idx_announcement_content_search ON "Announcement" USING GIN(to_tsvector('english', "messageContent"));

-- Date range queries
CREATE INDEX idx_attendance_checktime_range ON "Attendance"("checkInTime" DESC);
CREATE INDEX idx_task_date_range ON "Task"("startDate", "endDate");

-- ============================================================
-- Views for Common Queries (Optional but Helpful)
-- ============================================================

-- Active users view
CREATE OR REPLACE VIEW active_users AS
SELECT id, name, email, department, role, "createdAt"
FROM "User"
WHERE status = 'active';

-- Staff attendance summary view
CREATE OR REPLACE VIEW attendance_summary AS
SELECT 
  department,
  DATE("checkInTime") as date,
  COUNT(*) as total_staff,
  COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
  COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent,
  COUNT(CASE WHEN status = 'late' THEN 1 END) as late
FROM "Attendance"
GROUP BY department, DATE("checkInTime");

-- Inventory status view
CREATE OR REPLACE VIEW inventory_status AS
SELECT 
  category,
  COUNT(*) as total_items,
  SUM("quantityRemaining") as total_remaining,
  SUM(CASE WHEN "stockStatus" = 'Low Stock' THEN 1 END) as low_stock_count,
  SUM(CASE WHEN "stockStatus" = 'Out of Stock' THEN 1 END) as out_of_stock_count
FROM "Material"
GROUP BY category;

-- Daily report summary view
CREATE OR REPLACE VIEW daily_report_summary AS
SELECT 
  DATE(date) as report_date,
  department,
  COUNT(*) as total_reports,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
FROM "DailyReport"
GROUP BY DATE(date), department;

-- Agricultural project summary view
CREATE OR REPLACE VIEW project_summary AS
SELECT 
  "typeOfProject",
  COUNT(*) as total_projects,
  COUNT(CASE WHEN "projectStatus" = 'completed' THEN 1 END) as completed_projects,
  COUNT(b.id) as total_beneficiaries
FROM "AgriculturalProject" p
LEFT JOIN "Beneficiary" b ON p.id = b."projectId"
GROUP BY "typeOfProject";

-- ============================================================
-- End of Schema
-- ============================================================
-- All tables have been created with proper:
-- - Primary keys
-- - Foreign key constraints
-- - Indexes for common queries
-- - Timestamps (createdAt, updatedAt)
-- - Default values
-- - NOT NULL constraints where appropriate
