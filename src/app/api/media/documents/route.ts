import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { saveMultipleFilesWithDateStructure } from '@/lib/fileUtils';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const documents = await prisma.media.findMany({
      where: { type: 'document' },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {    const formData = await request.formData();
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const department = formData.get('department') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;

    // Handle file uploads
    const files = formData.getAll('files') as File[];
    let filePaths: string[] = [];

    if (files.length > 0) {
      // Validate files
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/rtf'
      ];
      const maxSize = 50 * 1024 * 1024; // 50MB

      for (const file of files) {
        if (!validTypes.includes(file.type)) {
          return NextResponse.json({ error: `${file.name} is not a supported document type` }, { status: 400 });
        }
        if (file.size > maxSize) {
          return NextResponse.json({ error: `${file.name} is too large. Maximum size is 50MB` }, { status: 400 });
        }
      }

      // Save files with date-based structure
      const documentDate = new Date(date);
      const uploadedFiles = await saveMultipleFilesWithDateStructure(files, 'documents', documentDate);
      filePaths = uploadedFiles.map(file => file.url);
    }

    // Create media records for each file
    const documentRecords = await Promise.all(
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
      { message: 'Documents uploaded successfully', documents: documentRecords },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create documents error:', error);
    return NextResponse.json({ error: 'Failed to upload documents' }, { status: 500 });
  }
}