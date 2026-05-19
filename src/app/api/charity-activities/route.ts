import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const activities = await prisma.charityActivity.findMany({
            orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Get charity activities error:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activityType, description, participants, location, date, impact } = body;

    const activity = await prisma.charityActivity.create({
      data: {
        activityType,
        description,
        participants,
        location,
        date: new Date(date),
        impact,
              },
    });

    return NextResponse.json(
      { message: 'Charity activity created successfully', activity },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create charity activity error:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}