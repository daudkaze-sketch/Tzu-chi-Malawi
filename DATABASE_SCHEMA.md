# Database Schema Diagram

## Table Relationships Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER - Core                                │
│  (Staff members: Admins, Staff, Volunteers)                             │
└──────────┬──────────────────────────────────────────────────────────────┘
           │
       ├─→ Creates DailyReport (daily activity logs)
       ├─→ Creates Attendance (check-in/out)
       ├─→ Creates Task (assignments)
       ├─→ Creates Material (inventory)
       ├─→ Creates TeachingActivity (Dharma/training)
       ├─→ Creates PreSchoolMonitoring (school reports)
       ├─→ Creates ScholarshipStudent (scholarship tracking)
       ├─→ Creates OfficeTraining (staff training)
       ├─→ Creates AgriculturalProject (projects)
       ├─→ Creates HomeVisit (family visits)
       ├─→ Creates ReliefDistribution (aid tracking)
       ├─→ Creates CharityActivity (community service)
       ├─→ Creates Media (photos/documents)
       └─→ Creates Announcement (office notices)

┌─────────────────────────────────────────────────────────────────────────┐
│                    AGRICULTURAL PROJECT - Resources                     │
│  (Crop & livestock initiatives)                                         │
└──────────┬──────────────────────────────────────────────────────────────┘
           │
       └─→ Has many Beneficiary (families in the project)

┌─────────────────────────────────────────────────────────────────────────┐
│                            VILLAGE - Geography                          │
│  (Malawi district divisions)                                            │
└──────────────────────────────────────────────────────────────────────────┘
           (Reference table - standalone)

┌─────────────────────────────────────────────────────────────────────────┐
│                              SURVEY - Assessments                       │
│  (Disaster & needs assessments)                                         │
└──────────────────────────────────────────────────────────────────────────┘
           (Standalone surveys - not tied to specific user)
```

## All 15 Tables

### 1. **User** 
Primary table for authentication and staff management

| Column | Type | Description |
|--------|------|-------------|
| id | String (Primary Key) | Unique identifier (CUID) |
| email | String | Login email (unique) |
| name | String | Full name |
| password | String | Hashed password |
| department | String? | Department assignment |
| role | String | Admin, Staff, or Volunteer |
| status | String | active/inactive |
| createdAt | DateTime | Account creation |
| updatedAt | DateTime | Last update |

**Relations**: One-to-many with 14 other tables

---

### 2. **DailyReport** 
Activity logging system

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| date | DateTime |
| department | String |
| workDone | String (text) |
| involved | String |
| location | String |
| challenges | String? |
| solutions | String? |
| status | in-progress/completed |
| images | String? (JSON array) |
| userId | String (Foreign Key) |

---

### 3. **Attendance** 
Staff presence tracking

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| name | String |
| department | String |
| checkInTime | DateTime |
| checkOutTime | DateTime? |
| status | present/absent/late |
| remarks | String? |
| userId | String (Foreign Key) |

---

### 4. **Task** 
Project & department task management

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| title | String |
| assignedTo | String |
| department | String |
| startDate | DateTime |
| endDate | DateTime |
| priority | High/Medium/Low |
| notes | String? |
| status | pending/in-progress/completed |
| userId | String (Foreign Key) |

---

### 5. **Material** 
Inventory & stock tracking

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| itemName | String |
| category | Food/Non-Food |
| quantityReceived | Int |
| quantityUsed | Int |
| quantityRemaining | Int |
| stockStatus | In Stock/Low Stock/Out of Stock |
| dateReceived | DateTime |
| receivedFrom | String? |
| issuedTo | String? |
| purposeOfUse | String? |
| storageLocation | String? |
| remarks | String? |
| userId | String (Foreign Key) |

---

### 6. **TeachingActivity** 
Education & Dharma teaching logs

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| type | Dharma/Jing Si Aphorism/Training |
| location | Office/School/Home Visit |
| participants | Int |
| ageGroup | String? |
| topicsCovered | String |
| duration | String? |
| materialsUsed | String? |
| understandingLevel | Good/Average/Poor |
| feedback | String? |
| challenges | String? |
| followUpPlan | String? |
| userId | String (Foreign Key) |

---

### 7. **PreSchoolMonitoring** 
School monitoring & assessment

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| schoolName | String |
| location | String |
| numberOfChildren | Int |
| numberOfTeachers | Int |
| attendanceRate | String |
| cleanlinessLevel | Good/Average/Poor |
| teachingQuality | String |
| learningMaterialsAvailability | String |
| nutritionStatus | String |
| challenges | String? |
| supportNeeded | String? |
| userId | String (Foreign Key) |

---

### 8. **ScholarshipStudent** 
Student support tracking

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| studentName | String |
| school | String |
| grade | String |
| academicPerformance | String |
| attendance | String |
| behavior | String |
| financialSupport | String |
| guardianDetails | String |
| progressReports | String? |
| challenges | String? |
| recommendations | String? |
| userId | String (Foreign Key) |

---

### 9. **OfficeTraining** 
Staff development & training

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| trainingTitle | String |
| trainerName | String |
| date | DateTime |
| duration | String |
| participants | String |
| objectives | String |
| topicsCovered | String |
| skillsGained | String? |
| evaluation | String? |
| feedback | String? |
| userId | String (Foreign Key) |

---

### 10. **AgriculturalProject** 
Crop and livestock projects

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| typeOfProject | Crop/Livestock |
| landSize | String? |
| inputsProvided | String? |
| farmingMethods | String? |
| expectedYield | String? |
| actualYield | String? |
| weatherChallenges | String? |
| projectStatus | not-started/in-progress/completed |
| userId | String (Foreign Key) |
| **Has**: Beneficiary[] |

---

### 11. **Beneficiary** 
Project beneficiary records

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| name | String |
| location | String? |
| contact | String? |
| typeOfSupport | String |
| projectId | String (Foreign Key) |
| progressStatus | String? |
| notes | String? |

**Relation**: Links to AgriculturalProject (one-to-many)

---

### 12. **HomeVisit** 
Family assessment visits

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| beneficiaryName | String |
| familySize | Int? |
| livingConditions | String? |
| mainChallenges | String? |
| healthCondition | String? |
| incomeSource | String? |
| immediateNeeds | String? |
| longTermNeeds | String? |
| recommendations | String? |
| followUpDate | DateTime? |
| userId | String (Foreign Key) |

---

### 13. **ReliefDistribution** 
Aid distribution tracking

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| beneficiaryName | String |
| beneficiaryId | String? |
| itemsReceived | String |
| quantity | Int |
| signature | String? |
| location | String |
| villageName | String |
| district | String |
| date | DateTime |
| distributionType | String |
| purpose | String |
| followUpNeeded | Boolean |
| notes | String? |
| userId | String (Foreign Key) |

---

### 14. **Survey** 
Disaster & needs assessment

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| areaAffected | String |
| typeOfDisaster | String |
| numberOfHouseholdsAffected | Int |
| numberOfInjured | Int? |
| urgentNeeds | String? |
| accessibilityOfArea | String? |
| photos | String? |
| recommendedAction | String? |

**Note**: Standalone table (not tied to User)

---

### 15. **CharityActivity** 
Community service activities

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| activityType | String (Community cleaning, Health support, etc) |
| description | String |
| participants | String? |
| location | String? |
| date | DateTime |
| impact | String? |
| userId | String (Foreign Key) |

---

### 16. **Village** 
Geographic reference table

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| name | String |
| district | String |
| activeVolunteers | Int |

**Note**: Standalone reference table for location management

---

### 17. **Media** 
Photos & document storage

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| title | String |
| type | Photo/Video/Report |
| department | String |
| eventName | String? |
| photographer | String? |
| location | String? |
| date | DateTime |
| description | String? |
| approvalStatus | Approved/Pending |
| filePath | String |
| userId | String (Foreign Key) |

---

### 18. **Announcement** 
Office communications

| Column | Type |
|--------|------|
| id | String (Primary Key) |
| title | String |
| type | General/Weekly Schedule/Emergency |
| messageContent | String |
| date | DateTime |
| priorityLevel | High/Medium/Low |
| attachments | String? (JSON array) |
| userId | String (Foreign Key) |

---

## Data Type Mappings

| Prisma Type | PostgreSQL Type | Description |
|------------|-----------------|-------------|
| String | VARCHAR(255) | Text up to 255 chars |
| String (text field) | TEXT | Unlimited text |
| Int | INTEGER | Whole numbers |
| DateTime | TIMESTAMP | Date and time |
| Boolean | BOOLEAN | True/False |
| @id | PRIMARY KEY | Unique identifier |
| @relation | FOREIGN KEY | Link to another table |

---

## Indexing Strategy

Indexes created for fast queries:
- User indexes on: email
- DailyReport indexes on: userId, date
- Attendance indexes on: userId
- Task indexes on: userId, status
- Material indexes on: userId
- TeachingActivity indexes on: userId
- And more...

These make searches like "find all tasks for user X that are pending" fast!

