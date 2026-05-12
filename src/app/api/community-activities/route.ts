import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const activities = await prisma.charityActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('GET activities error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const body = await request.json();
    const {
      activityTitle,
      activityType,
      description,
      location,
      date,
      startTime,
      endTime,
      participants,
      ageGroups,
      outcome,
      challenges,
      lessons,
      impact,
      targetBeneficiaries,
      materials,
      volunteerInvolved,
      followUpActions,
    } = body;

    // Store as extended activity record with all details in description/notes
    const activityData = {
      activityType,
      description: activityTitle,
      participants: `${participants} participants | Age Groups: ${ageGroups} | Volunteers: ${volunteerInvolved}`,
      location,
      date,
      impact: `Title: ${activityTitle}\n\nType: ${activityType}\nLocation: ${location}\nDate: ${date}\nStart: ${startTime}\nEnd: ${endTime}\nParticipants: ${participants}\nAge Groups: ${ageGroups}\n\nDescription: ${description}\n\nOutcome: ${outcome}\n\nImpact: ${impact}\n\nTarget Beneficiaries: ${targetBeneficiaries}\n\nMaterials Used: ${materials}\n\nChallenges: ${challenges}\n\nLessons Learned: ${lessons}\n\nFollow-up Actions: ${followUpActions}`,
      userId,
    };

    const activity = await prisma.charityActivity.create({
      data: activityData,
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error('POST activity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}