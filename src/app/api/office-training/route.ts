import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const trainings = await prisma.officeTraining.findMany({
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