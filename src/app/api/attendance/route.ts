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

    const attendances = await prisma.attendance.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ attendances });
  } catch (error) {
    console.error('Get attendance error:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, department, checkInTime, checkOutTime, status, remarks } = body;

    const attendance = await prisma.attendance.create({
      data: {
        name,
        department,
        checkInTime: new Date(checkInTime),
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
        status,
        remarks,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: 'Attendance recorded successfully', attendance },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create attendance error:', error);
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
  }
}
