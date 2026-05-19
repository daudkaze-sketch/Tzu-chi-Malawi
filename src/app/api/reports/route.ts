import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { saveMultipleFilesWithDateStructure } from '@/lib/fileUtils';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {

    const reports = await prisma.dailyReport.findMany({
            orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {

    const formData = await request.formData();
    const date = formData.get('date') as string;
    const department = formData.get('department') as string;
    const workDone = formData.get('workDone') as string;
    const involved = formData.get('involved') as string;
    const location = formData.get('location') as string;
    const challenges = formData.get('challenges') as string;
    const solutions = formData.get('solutions') as string;
    const status = formData.get('status') as string;

    // Handle file uploads
    const images = formData.getAll('images') as File[];
    let imageData: { url: string; caption?: string }[] = [];

    if (images.length > 0) {
      // Validate files
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      for (const image of images) {
        if (!validTypes.includes(image.type)) {
          return NextResponse.json({ error: `${image.name} is not a valid image file` }, { status: 400 });
        }
        if (image.size > maxSize) {
          return NextResponse.json({ error: `${image.name} is too large. Maximum size is 5MB` }, { status: 400 });
        }
      }

      // Save files with date-based structure
      const reportDate = new Date(date);
      const uploadedFiles = await saveMultipleFilesWithDateStructure(images, 'reports', reportDate);

      // Add captions to uploaded files
      imageData = uploadedFiles.map((file, index) => ({
        url: file.url,
        caption: formData.get(`caption_${index}`) as string || undefined,
      }));
    }

    const report = await prisma.dailyReport.create({
      data: {
        date: new Date(date),
        department,
        workDone,
        involved,
        location,
        challenges,
        solutions,
        status,
        images: imageData.length > 0 ? JSON.stringify(imageData) : null,
              },
    });

    return NextResponse.json(
      { message: 'Report created successfully', report },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
