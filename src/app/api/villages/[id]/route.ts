import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { name, district, activeVolunteers } = body;

    const village = await prisma.village.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(district && { district }),
        ...(activeVolunteers !== undefined && { activeVolunteers }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ village });
  } catch (error) {
    console.error('PUT village error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {

    await prisma.village.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Village deleted' });
  } catch (error) {
    console.error('DELETE village error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
