import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const visits = await prisma.homeVisit.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ visits });
  } catch (error) {
    console.error('Get home visits error:', error);
    return NextResponse.json({ error: 'Failed to fetch home visits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      beneficiaryName,
      familySize,
      livingConditions,
      mainChallenges,
      healthCondition,
      incomeSource,
      immediateNeeds,
      longTermNeeds,
      recommendations,
      followUpDate,
    } = body;

    const visit = await prisma.homeVisit.create({
      data: {
        beneficiaryName,
        familySize,
        livingConditions,
        mainChallenges,
        healthCondition,
        incomeSource,
        immediateNeeds,
        longTermNeeds,
        recommendations,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
              },
    });

    return NextResponse.json(
      { message: 'Home visit recorded successfully', visit },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create home visit error:', error);
    return NextResponse.json({ error: 'Failed to record home visit' }, { status: 500 });
  }
}