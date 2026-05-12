import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { saveFileWithDateStructure } from '@/lib/fileUtils';

const prisma = new PrismaClient();

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  return authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
}

export async function GET(request: NextRequest) {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ media });
  } catch (error) {
    console.error('Get media error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const department = formData.get('department') as string;
    const eventName = formData.get('eventName') as string;
    const location = formData.get('location') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const photographer = formData.get('photographer') as string;

    // Handle file upload
    const file = formData.get('file') as File;
    let filePath = '';

    if (file) {
      // Validate file
      const validTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/avi', 'video/mov'
      ];
      const maxSize = 50 * 1024 * 1024; // 50MB for videos

      if (!validTypes.includes(file.type)) {
        return NextResponse.json({ error: `${file.name} is not a supported file type` }, { status: 400 });
      }
      if (file.size > maxSize) {
        return NextResponse.json({ error: `${file.name} is too large. Maximum size is 50MB` }, { status: 400 });
      }

      // Save file with date-based structure
      const mediaDate = new Date(date);
      filePath = await saveFileWithDateStructure(file, 'media', mediaDate);
    }

    const media = await prisma.media.create({
      data: {
        title,
        type,
        department,
        eventName,
        location,
        date: new Date(date),
        description,
        photographer,
        filePath,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(
      { message: 'Media uploaded successfully', media },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create media error:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}