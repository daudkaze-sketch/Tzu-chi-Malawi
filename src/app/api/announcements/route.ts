import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { saveMultipleFilesWithDateStructure } from '@/lib/fileUtils';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const messageContent = formData.get('messageContent') as string;
    const date = formData.get('date') as string;
    const priorityLevel = formData.get('priorityLevel') as string;
    const eventType = formData.get('eventType') as string;
    const newsCategory = formData.get('newsCategory') as string;

    const detailLines = [
      newsCategory ? `Related area: ${newsCategory}` : '',
      eventType ? `Event type: ${eventType}` : '',
    ].filter(Boolean);

    const fullMessageContent = [messageContent, detailLines.join('\n')].filter(Boolean).join('\n\n');

    // Handle file uploads
    const attachments = formData.getAll('attachments') as File[];
    let attachmentData: { url: string; name?: string }[] = [];

    if (attachments.length > 0) {
      // Validate files
      const validTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      for (const file of attachments) {
        if (!validTypes.includes(file.type)) {
          return NextResponse.json({ error: `${file.name} is not a supported file type` }, { status: 400 });
        }
        if (file.size > maxSize) {
          return NextResponse.json({ error: `${file.name} is too large. Maximum size is 10MB` }, { status: 400 });
        }
      }

      // Save files with date-based structure
      const announcementDate = new Date(date);
      const uploadedFiles = await saveMultipleFilesWithDateStructure(attachments, 'announcements', announcementDate);

      // Add original filenames to uploaded files
      attachmentData = uploadedFiles.map((file, index) => ({
        url: file.url,
        name: attachments[index].name,
      }));
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        type,
        messageContent: fullMessageContent,
        date: new Date(date),
        priorityLevel,
        attachments: attachmentData.length > 0 ? JSON.stringify(attachmentData) : null,
              },
    });

    return NextResponse.json(
      { message: 'Announcement created successfully', announcement },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
