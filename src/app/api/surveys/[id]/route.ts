import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { saveMultipleFilesWithDateStructure } from '@/lib/fileUtils';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.survey.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    console.error('DELETE survey error:', error);
    return NextResponse.json({ error: 'Failed to delete survey' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';
    let updateData: any = {};

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
      const mainChallenges = formData.get('mainChallenges') as string;
      const immediateNeeds = formData.get('immediateNeeds') as string;
      const waterAccess = formData.get('waterAccess') as string;
      const foodSituation = formData.get('foodSituation') as string;
      const healthStatus = formData.get('healthStatus') as string;
      const shelterCondition = formData.get('shelterCondition') as string;
      const infrastructureDamage = formData.get('infrastructureDamage') as string;
      const livestock = formData.get('livestock') as string;
      const crops = formData.get('crops') as string;
      const economicImpact = formData.get('economicImpact') as string;
      const vulnerablePeople = formData.get('vulnerablePeople') as string;
      const accessibilityRating = formData.get('accessibilityRating') as string;
      const securityStatus = formData.get('securityStatus') as string;
      const governmentResponse = formData.get('governmentResponse') as string;
      const recommendations = formData.get('recommendations') as string;
      const priority = formData.get('priority') as string;

      const attachmentFiles = formData.getAll('attachments') as File[];
      let attachmentUrls: string[] = [];

      if (attachmentFiles.length > 0) {
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        const maxSize = 50 * 1024 * 1024;

        for (const file of attachmentFiles) {
          const isImage = validImageTypes.includes(file.type);
          const isVideo = validVideoTypes.includes(file.type);

          if (!isImage && !isVideo) {
            return NextResponse.json({ error: `${file.name} is not a valid image or video file` }, { status: 400 });
          }
          if (file.size > maxSize) {
            return NextResponse.json({ error: `${file.name} is too large. Maximum size is 50MB` }, { status: 400 });
          }
        }

        const surveyDate = new Date(date);
        const uploadedFiles = await saveMultipleFilesWithDateStructure(attachmentFiles, 'surveys', surveyDate);
        attachmentUrls = uploadedFiles.map(file => file.url);
      }

      updateData = {
        areaAffected: areaName,
        typeOfDisaster: surveyType,
        numberOfHouseholdsAffected: householdsAffected,
        numberOfInjured: volunteersAffected || undefined,
        urgentNeeds: immediateNeeds,
        accessibilityOfArea: accessibilityRating,
        photos: attachmentUrls.length > 0 ? JSON.stringify(attachmentUrls) : undefined,
        recommendedAction: recommendations,
      };
    } else {
      const body = await request.json();
      updateData = {
        areaAffected: body.areaName,
        typeOfDisaster: body.surveyType,
        numberOfHouseholdsAffected: body.householdsAffected || 0,
        numberOfInjured: body.volunteersAffected || null,
        urgentNeeds: body.immediateNeeds,
        accessibilityOfArea: body.accessibilityRating,
        photos: body.attachments ? JSON.stringify(body.attachments) : undefined,
        recommendedAction: body.recommendations,
      };
    }

    const updatedSurvey = await prisma.survey.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ survey: updatedSurvey });
  } catch (error) {
    console.error('PATCH survey error:', error);
    return NextResponse.json({ error: 'Failed to update survey' }, { status: 500 });
  }
}
