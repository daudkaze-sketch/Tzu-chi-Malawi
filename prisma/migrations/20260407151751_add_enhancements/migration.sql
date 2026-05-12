/*
  Warnings:

  - You are about to drop the column `description` on the `AgriculturalProject` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `AgriculturalProject` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `AgriculturalProject` table. All the data in the column will be lost.
  - You are about to drop the column `peopleInvolved` on the `AgriculturalProject` table. All the data in the column will be lost.
  - You are about to drop the column `progressStatus` on the `AgriculturalProject` table. All the data in the column will be lost.
  - You are about to drop the column `projectName` on the `AgriculturalProject` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `AgriculturalProject` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `media` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `media` on the `DailyReport` table. All the data in the column will be lost.
  - You are about to drop the column `findings` on the `HomeVisit` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `HomeVisit` table. All the data in the column will be lost.
  - You are about to drop the column `purpose` on the `HomeVisit` table. All the data in the column will be lost.
  - You are about to drop the column `supportNeeded` on the `HomeVisit` table. All the data in the column will be lost.
  - You are about to drop the column `dateAdded` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `purpose` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `remainingStock` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `usedBy` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfBeneficiaries` on the `ReliefDistribution` table. All the data in the column will be lost.
  - You are about to drop the column `quantityDistributed` on the `ReliefDistribution` table. All the data in the column will be lost.
  - You are about to drop the column `typeOfRelief` on the `ReliefDistribution` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfVictims` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `typeOfProject` to the `AgriculturalProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageContent` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priorityLevel` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateReceived` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beneficiaryName` to the `ReliefDistribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemsReceived` to the `ReliefDistribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ReliefDistribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfHouseholdsAffected` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Beneficiary" ADD COLUMN "location" TEXT;
ALTER TABLE "Beneficiary" ADD COLUMN "progressStatus" TEXT;

-- AlterTable
ALTER TABLE "TeachingActivity" ADD COLUMN "ageGroup" TEXT;
ALTER TABLE "TeachingActivity" ADD COLUMN "challenges" TEXT;
ALTER TABLE "TeachingActivity" ADD COLUMN "duration" TEXT;
ALTER TABLE "TeachingActivity" ADD COLUMN "followUpPlan" TEXT;
ALTER TABLE "TeachingActivity" ADD COLUMN "materialsUsed" TEXT;
ALTER TABLE "TeachingActivity" ADD COLUMN "understandingLevel" TEXT;

-- CreateTable
CREATE TABLE "PreSchoolMonitoring" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schoolName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "numberOfChildren" INTEGER NOT NULL,
    "numberOfTeachers" INTEGER NOT NULL,
    "attendanceRate" TEXT NOT NULL,
    "cleanlinessLevel" TEXT NOT NULL,
    "teachingQuality" TEXT NOT NULL,
    "learningMaterialsAvailability" TEXT NOT NULL,
    "nutritionStatus" TEXT NOT NULL,
    "challenges" TEXT,
    "supportNeeded" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "PreSchoolMonitoring_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScholarshipStudent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentName" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "academicPerformance" TEXT NOT NULL,
    "attendance" TEXT NOT NULL,
    "behavior" TEXT NOT NULL,
    "financialSupport" TEXT NOT NULL,
    "guardianDetails" TEXT NOT NULL,
    "progressReports" TEXT,
    "challenges" TEXT,
    "recommendations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ScholarshipStudent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OfficeTraining" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trainingTitle" TEXT NOT NULL,
    "trainerName" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "duration" TEXT NOT NULL,
    "participants" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "topicsCovered" TEXT NOT NULL,
    "skillsGained" TEXT,
    "evaluation" TEXT,
    "feedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "OfficeTraining_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharityActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "participants" TEXT,
    "location" TEXT,
    "date" DATETIME NOT NULL,
    "impact" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CharityActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AgriculturalProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "typeOfProject" TEXT NOT NULL,
    "landSize" TEXT,
    "inputsProvided" TEXT,
    "farmingMethods" TEXT,
    "expectedYield" TEXT,
    "actualYield" TEXT,
    "weatherChallenges" TEXT,
    "projectStatus" TEXT NOT NULL DEFAULT 'not-started',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "AgriculturalProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AgriculturalProject" ("createdAt", "id", "updatedAt", "userId") SELECT "createdAt", "id", "updatedAt", "userId" FROM "AgriculturalProject";
DROP TABLE "AgriculturalProject";
ALTER TABLE "new_AgriculturalProject" RENAME TO "AgriculturalProject";
CREATE INDEX "AgriculturalProject_userId_idx" ON "AgriculturalProject"("userId");
CREATE TABLE "new_Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "messageContent" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "priorityLevel" TEXT NOT NULL,
    "attachments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Announcement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Announcement" ("createdAt", "date", "id", "title", "updatedAt", "userId") SELECT "createdAt", "date", "id", "title", "updatedAt", "userId" FROM "Announcement";
DROP TABLE "Announcement";
ALTER TABLE "new_Announcement" RENAME TO "Announcement";
CREATE INDEX "Announcement_userId_date_idx" ON "Announcement"("userId", "date");
CREATE TABLE "new_DailyReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "department" TEXT NOT NULL,
    "workDone" TEXT NOT NULL,
    "involved" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "challenges" TEXT,
    "solutions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in-progress',
    "images" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "DailyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DailyReport" ("challenges", "createdAt", "date", "department", "id", "involved", "location", "solutions", "status", "updatedAt", "userId", "workDone") SELECT "challenges", "createdAt", "date", "department", "id", "involved", "location", "solutions", "status", "updatedAt", "userId", "workDone" FROM "DailyReport";
DROP TABLE "DailyReport";
ALTER TABLE "new_DailyReport" RENAME TO "DailyReport";
CREATE INDEX "DailyReport_userId_date_idx" ON "DailyReport"("userId", "date");
CREATE TABLE "new_HomeVisit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "beneficiaryName" TEXT NOT NULL,
    "familySize" INTEGER,
    "livingConditions" TEXT,
    "mainChallenges" TEXT,
    "healthCondition" TEXT,
    "incomeSource" TEXT,
    "immediateNeeds" TEXT,
    "longTermNeeds" TEXT,
    "recommendations" TEXT,
    "followUpDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "HomeVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HomeVisit" ("beneficiaryName", "createdAt", "id", "updatedAt", "userId") SELECT "beneficiaryName", "createdAt", "id", "updatedAt", "userId" FROM "HomeVisit";
DROP TABLE "HomeVisit";
ALTER TABLE "new_HomeVisit" RENAME TO "HomeVisit";
CREATE INDEX "HomeVisit_userId_idx" ON "HomeVisit"("userId");
CREATE TABLE "new_Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantityReceived" INTEGER NOT NULL DEFAULT 0,
    "quantityUsed" INTEGER NOT NULL DEFAULT 0,
    "quantityRemaining" INTEGER NOT NULL DEFAULT 0,
    "stockStatus" TEXT NOT NULL DEFAULT 'In Stock',
    "dateReceived" DATETIME NOT NULL,
    "receivedFrom" TEXT,
    "issuedTo" TEXT,
    "purposeOfUse" TEXT,
    "storageLocation" TEXT,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Material_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Material" ("category", "createdAt", "id", "itemName", "updatedAt", "userId") SELECT "category", "createdAt", "id", "itemName", "updatedAt", "userId" FROM "Material";
DROP TABLE "Material";
ALTER TABLE "new_Material" RENAME TO "Material";
CREATE INDEX "Material_userId_idx" ON "Material"("userId");
CREATE TABLE "new_Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "eventName" TEXT,
    "photographer" TEXT,
    "location" TEXT,
    "date" DATETIME NOT NULL,
    "description" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'Pending',
    "filePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("createdAt", "date", "department", "description", "filePath", "id", "title", "type", "updatedAt", "userId") SELECT "createdAt", "date", "department", "description", "filePath", "id", "title", "type", "updatedAt", "userId" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
CREATE INDEX "Media_userId_department_idx" ON "Media"("userId", "department");
CREATE TABLE "new_ReliefDistribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "beneficiaryName" TEXT NOT NULL,
    "beneficiaryId" TEXT,
    "itemsReceived" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "signature" TEXT,
    "location" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ReliefDistribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReliefDistribution" ("createdAt", "date", "id", "location", "updatedAt", "userId") SELECT "createdAt", "date", "id", "location", "updatedAt", "userId" FROM "ReliefDistribution";
DROP TABLE "ReliefDistribution";
ALTER TABLE "new_ReliefDistribution" RENAME TO "ReliefDistribution";
CREATE INDEX "ReliefDistribution_userId_idx" ON "ReliefDistribution"("userId");
CREATE TABLE "new_Survey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "areaAffected" TEXT NOT NULL,
    "typeOfDisaster" TEXT NOT NULL,
    "numberOfHouseholdsAffected" INTEGER NOT NULL,
    "numberOfInjured" INTEGER,
    "urgentNeeds" TEXT,
    "accessibilityOfArea" TEXT,
    "photos" TEXT,
    "recommendedAction" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Survey" ("areaAffected", "createdAt", "id", "photos", "typeOfDisaster", "updatedAt", "urgentNeeds") SELECT "areaAffected", "createdAt", "id", "photos", "typeOfDisaster", "updatedAt", "urgentNeeds" FROM "Survey";
DROP TABLE "Survey";
ALTER TABLE "new_Survey" RENAME TO "Survey";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PreSchoolMonitoring_userId_idx" ON "PreSchoolMonitoring"("userId");

-- CreateIndex
CREATE INDEX "ScholarshipStudent_userId_idx" ON "ScholarshipStudent"("userId");

-- CreateIndex
CREATE INDEX "OfficeTraining_userId_idx" ON "OfficeTraining"("userId");

-- CreateIndex
CREATE INDEX "CharityActivity_userId_idx" ON "CharityActivity"("userId");
