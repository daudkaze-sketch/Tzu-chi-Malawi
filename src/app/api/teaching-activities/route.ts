import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  return authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const activities = await prisma.teachingActivity.findMany({
      where: { userId: decoded.userId },
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
    const token = getToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

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
        userId: decoded.userId,
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