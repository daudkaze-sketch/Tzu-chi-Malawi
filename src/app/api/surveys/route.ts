import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { saveMultipleFilesWithDateStructure } from '@/lib/fileUtils';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const surveys = await prisma.survey.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ surveys });
  } catch (error) {
    console.error('Get surveys error:', error);
    return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    // Handle FormData with file uploads
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      const surveyTitle = formData.get('surveyTitle') as string;
      const surveyType = formData.get('surveyType') as string;
      const areaName = formData.get('areaName') as string;
      const district = formData.get('district') as string;
      const date = formData.get('date') as string;
      const surveyPersonName = formData.get('surveyPersonName') as string;
      const surveyPersonRole = formData.get('surveyPersonRole') as string;
      const isVolunteer = formData.get('isVolunteer') === 'true';
      const affectedPeople = parseInt(formData.get('affectedPeople') as string) || 0;
      const householdsAffected = parseInt(formData.get('householdsAffected') as string) || 0;
      const volunteersAffected = parseInt(formData.get('volunteersAffected') as string) || 0;
      const volunteerHouseholdsAffected = parseInt(formData.get('volunteerHouseholdsAffected') as string) || 0;

      // Handle file uploads
      const attachmentFiles = formData.getAll('attachments') as File[];
      let attachmentUrls: string[] = [];

      if (attachmentFiles.length > 0) {
        // Validate files
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        const maxSize = 50 * 1024 * 1024; // 50MB

        for (const file of attachmentFiles) {
          const isImage = validImageTypes.includes(file.type);
          const isVideo = validVideoTypes.includes(file.type);
          
          if (!isImage && !isVideo) {
            return NextResponse.json(
              { error: `${file.name} is not a valid image or video file` },
              { status: 400 }
            );
          }
          if (file.size > maxSize) {
            return NextResponse.json(
              { error: `${file.name} is too large. Maximum size is 50MB` },
              { status: 400 }
            );
          }
        }

        // Save files with date-based structure (using existing saveMultipleFilesWithDateStructure)
        try {
          const surveyDate = new Date(date);
          const uploadedFiles = await saveMultipleFilesWithDateStructure(
            attachmentFiles,
            'surveys',
            surveyDate
          );
          attachmentUrls = uploadedFiles.map(file => file.url);
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          return NextResponse.json(
            { error: 'Failed to upload files' },
            { status: 500 }
          );
        }
      }

      // Compile comprehensive survey notes
      const completeNotes = `
SURVEY DETAILS
==============
Surveyor: ${surveyPersonName} (${surveyPersonRole})
Is Volunteer: ${isVolunteer ? 'Yes' : 'No'}
Survey Type: ${surveyType}
District: ${district}
Date: ${date}

IMPACT SUMMARY
==============
People Affected: ${affectedPeople}
Households Affected: ${householdsAffected}
Volunteers Affected: ${volunteersAffected}
Volunteer Households Affected: ${volunteerHouseholdsAffected}

DETAILED ASSESSMENT
===================
Main Challenges: ${formData.get('mainChallenges')}
Immediate Needs: ${formData.get('immediateNeeds')}
Vulnerable People: ${formData.get('vulnerablePeople')}

WATER & SANITATION: ${formData.get('waterAccess')}
FOOD SECURITY: ${formData.get('foodSituation')}
HEALTH STATUS: ${formData.get('healthStatus')}
SHELTER: ${formData.get('shelterCondition')}
INFRASTRUCTURE: ${formData.get('infrastructureDamage')}
LIVESTOCK & CROPS: ${formData.get('livestock')}
ECONOMIC IMPACT: ${formData.get('economicImpact')}

OPERATIONAL ASSESSMENT
======================
Accessibility: ${formData.get('accessibilityRating')}
Security Status: ${formData.get('securityStatus')}
Government Response: ${formData.get('governmentResponse')}

RECOMMENDATIONS
===============
Priority: ${formData.get('priority')}
${formData.get('recommendations')}

${attachmentUrls.length > 0 ? `SUPPORTING MEDIA
================
Attached Files: ${attachmentUrls.join(', ')}` : ''}
      `.trim();

      const survey = await prisma.survey.create({
        data: {
          areaAffected: areaName,
          typeOfDisaster: surveyType,
          numberOfHouseholdsAffected: householdsAffected,
          numberOfInjured: volunteersAffected, // Store volunteers affected here for now
          urgentNeeds: formData.get('immediateNeeds') as string,
          accessibilityOfArea: formData.get('accessibilityRating') as string,
          photos: attachmentUrls.length > 0 ? JSON.stringify(attachmentUrls) : completeNotes,
          recommendedAction: formData.get('recommendations') as string,
        },
      });

      return NextResponse.json(
        { message: 'Survey created successfully', survey },
        { status: 201 }
      );
    } else {
      // Legacy JSON support
      const surveyData = await request.json();
      
      const {
        areaName,
        district,
        surveyType,
        numberOfHouseholdsAffected,
        numberOfInjured,
        urgentNeeds,
        accessibilityOfArea,
        recommendedAction,
        surveyPersonName,
        isVolunteer,
      } = surveyData;

      const completeNotes = `
SURVEY DETAILS
==============
Surveyor: ${surveyPersonName}
Is Volunteer: ${isVolunteer ? 'Yes' : 'No'}
Survey Type: ${surveyType}

${Object.entries(surveyData).map(([key, value]) => {
  if (value && !['areaName', 'district', 'surveyType', 'numberOfHouseholdsAffected', 'numberOfInjured', 'surveyPersonName', 'isVolunteer'].includes(key)) {
    return `${key}: ${value}`;
  }
  return '';
}).filter(Boolean).join('\n')}
      `.trim();

      const survey = await prisma.survey.create({
        data: {
          areaAffected: areaName,
          typeOfDisaster: surveyType,
          numberOfHouseholdsAffected: numberOfHouseholdsAffected || 0,
          numberOfInjured: numberOfInjured || null,
          urgentNeeds,
          accessibilityOfArea,
          photos: completeNotes,
          recommendedAction,
        },
      });

      return NextResponse.json(
        { message: 'Survey created successfully', survey },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Create survey error:', error);
    return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 });
  }
}