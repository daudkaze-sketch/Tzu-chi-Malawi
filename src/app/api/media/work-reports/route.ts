import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { saveMultipleFilesWithDateStructure } from '@/lib/fileUtils';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {    const formData = await request.formData();
    const title = formData.get('title') as string;
    const type = (formData.get('type') as string) || 'work-report';
    const department = formData.get('department') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;

    // Handle file uploads
    const files = formData.getAll('files') as File[];
    let filePaths: string[] = [];

    if (files.length > 0) {
      // Validate files
      const validTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/avi', 'video/mov'
      ];
      const maxSize = 100 * 1024 * 1024; // 100MB for videos

      for (const file of files) {
        if (!validTypes.includes(file.type)) {
          return NextResponse.json({ error: `${file.name} is not a supported file type` }, { status: 400 });
        }
        if (file.size > maxSize) {
          return NextResponse.json({ error: `${file.name} is too large. Maximum size is 100MB` }, { status: 400 });
        }
      }

      // Save files with date-based structure
      const mediaDate = new Date(date);
      const uploadedFiles = await saveMultipleFilesWithDateStructure(files, 'media', mediaDate);
      filePaths = uploadedFiles.map(file => file.url);
    }

    // Create media records for each file
    const mediaRecords = await Promise.all(
      filePaths.map(filePath =>
        prisma.media.create({
          data: {
            title,
            type,
            department,
            date: new Date(date),
            description,
            filePath,
                      },
        })
      )
    );

    return NextResponse.json(
      { message: 'Work report media uploaded successfully', media: mediaRecords },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create work report media error:', error);
    return NextResponse.json({ error: 'Failed to upload work report media' }, { status: 500 });
  }
}
