import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {

    const attendances = await prisma.attendance.findMany({
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
