import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const students = await prisma.scholarshipStudent.findMany({
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