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
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const visits = await prisma.homeVisit.findMany({
      where: { userId: decoded.userId },
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
    const token = getToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

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
        userId: decoded.userId,
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