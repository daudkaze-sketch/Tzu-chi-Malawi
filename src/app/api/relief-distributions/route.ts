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

    const distributions = await prisma.reliefDistribution.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ distributions });
  } catch (error) {
    console.error('GET distributions error:', error);
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
      beneficiaryName,
      beneficiaryId,
      itemsReceived,
      quantity,
      signature,
      location,
      villageName,
      district,
      date,
      distributionType,
      purpose,
      followUpNeeded,
      notes,
    } = body;

    const distribution = await prisma.reliefDistribution.create({
      data: {
        beneficiaryName,
        beneficiaryId,
        itemsReceived,
        quantity,
        signature,
        location,
        villageName,
        district,
        date,
        distributionType,
        purpose,
        followUpNeeded,
        notes,
        userId,
      },
    });

    return NextResponse.json({ distribution }, { status: 201 });
  } catch (error) {
    console.error('POST distribution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}