import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const monitorings = await prisma.preSchoolMonitoring.findMany({
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