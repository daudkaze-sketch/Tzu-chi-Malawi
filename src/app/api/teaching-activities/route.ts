import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const activities = await prisma.teachingActivity.findMany({
            orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Get teaching activities error:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, location, participants, ageGroup, topicsCovered, duration, materialsUsed, understandingLevel, feedback, challenges, followUpPlan } = body;

    const activity = await prisma.teachingActivity.create({
      data: {
        type,
        location,
        participants,
        ageGroup,
        topicsCovered,
        duration,
        materialsUsed,
        understandingLevel,
        feedback,
        challenges,
        followUpPlan,
              },
    });

    return NextResponse.json(
      { message: 'Teaching activity created successfully', activity },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create teaching activity error:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}