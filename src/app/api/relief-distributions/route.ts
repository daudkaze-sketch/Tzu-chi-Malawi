import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {

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
      },
    });

    return NextResponse.json({ distribution }, { status: 201 });
  } catch (error) {
    console.error('POST distribution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}