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

    const trainings = await prisma.officeTraining.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ trainings });
  } catch (error) {
    console.error('Get office training error:', error);
    return NextResponse.json({ error: 'Failed to fetch trainings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { trainingTitle, trainerName, date, duration, participants, objectives, topicsCovered, skillsGained, evaluation, feedback } = body;

    const training = await prisma.officeTraining.create({
      data: {
        trainingTitle,
        trainerName,
        date: new Date(date),
        duration,
        participants,
        objectives,
        topicsCovered,
        skillsGained,
        evaluation,
        feedback,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(
      { message: 'Office training created successfully', training },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create office training error:', error);
    return NextResponse.json({ error: 'Failed to create training' }, { status: 500 });
  }
}