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
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const monitorings = await prisma.preSchoolMonitoring.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ monitorings });
  } catch (error) {
    console.error('Get pre-school monitoring error:', error);
    return NextResponse.json({ error: 'Failed to fetch monitorings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { schoolName, location, numberOfChildren, numberOfTeachers, attendanceRate, cleanlinessLevel, teachingQuality, learningMaterialsAvailability, nutritionStatus, challenges, supportNeeded } = body;

    const monitoring = await prisma.preSchoolMonitoring.create({
      data: {
        schoolName,
        location,
        numberOfChildren,
        numberOfTeachers,
        attendanceRate,
        cleanlinessLevel,
        teachingQuality,
        learningMaterialsAvailability,
        nutritionStatus,
        challenges,
        supportNeeded,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(
      { message: 'Pre-school monitoring created successfully', monitoring },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create pre-school monitoring error:', error);
    return NextResponse.json({ error: 'Failed to create monitoring' }, { status: 500 });
  }
}