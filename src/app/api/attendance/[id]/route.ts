import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const record = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    
    await prisma.attendance.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('DELETE attendance error:', error);
    return NextResponse.json({ error: 'Failed to delete attendance' }, { status: 500 });
  }
}
