import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {

    const villages = await prisma.village.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Map to include isEdited flag
    const mappedVillages = villages.map(v => ({
      ...v,
      isEdited: v.updatedAt > v.createdAt,
    }));

    return NextResponse.json({ villages: mappedVillages });
  } catch (error) {
    console.error('GET villages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const { name, district, activeVolunteers } = body;

    if (!name || !district) {
      return NextResponse.json(
        { error: 'Name and district are required' },
        { status: 400 }
      );
    }

    const village = await prisma.village.create({
      data: {
        name,
        district,
        activeVolunteers: activeVolunteers || 0,
      },
    });

    return NextResponse.json({ village }, { status: 201 });
  } catch (error) {
    console.error('POST village error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
