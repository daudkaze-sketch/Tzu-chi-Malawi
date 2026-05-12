import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const materials = await prisma.material.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ materials });
  } catch (error) {
    console.error('Get materials error:', error);
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { itemName, category, quantityReceived, quantityUsed, stockStatus, dateReceived, receivedFrom, issuedTo, purposeOfUse, storageLocation, remarks } = body;

    const quantityRemaining = quantityReceived - quantityUsed;

    const material = await prisma.material.create({
      data: {
        itemName,
        category,
        quantityReceived,
        quantityUsed,
        quantityRemaining,
        stockStatus,
        dateReceived: new Date(dateReceived),
        receivedFrom,
        issuedTo,
        purposeOfUse,
        storageLocation,
        remarks,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(
      { message: 'Material added successfully', material },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create material error:', error);
    return NextResponse.json({ error: 'Failed to add material' }, { status: 500 });
  }
}
