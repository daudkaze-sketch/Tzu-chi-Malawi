import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const distribution = await prisma.reliefDistribution.findUnique({
      where: { id: params.id },
    });

    if (!distribution) {
      return NextResponse.json({ error: 'Distribution not found' }, { status: 404 });
    }

    if (distribution.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.reliefDistribution.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Distribution deleted successfully' });
  } catch (error) {
    console.error('DELETE distribution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const distribution = await prisma.reliefDistribution.findUnique({
      where: { id: params.id },
    });

    if (!distribution) {
      return NextResponse.json({ error: 'Distribution not found' }, { status: 404 });
    }

    if (distribution.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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

    const updatedDistribution = await prisma.reliefDistribution.update({
      where: { id: params.id },
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

    return NextResponse.json({ distribution: updatedDistribution });
  } catch (error) {
    console.error('PATCH distribution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
