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

    const students = await prisma.scholarshipStudent.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Get scholarship students error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { studentName, school, grade, academicPerformance, attendance, behavior, financialSupport, guardianDetails, progressReports, challenges, recommendations } = body;

    const student = await prisma.scholarshipStudent.create({
      data: {
        studentName,
        school,
        grade,
        academicPerformance,
        attendance,
        behavior,
        financialSupport,
        guardianDetails,
        progressReports,
        challenges,
        recommendations,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(
      { message: 'Scholarship student created successfully', student },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create scholarship student error:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}