import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const body = await request.json();
    const records = body.records || [];

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'No valid records to import' },
        { status: 400 }
      );
    }

    let importedCount = 0;
    const errors = [];

    for (const record of records) {
      try {
        if (!record.name || !record.category || !record.priority) {
          errors.push(`Skipped row: Missing required fields`);
          continue;
        }

        await prisma.beneficiary.create({
          data: {
            name: record.name || '',
            location: record.address || '',
            contact: record.phone || '',
            typeOfSupport: record.category || '',
            progressStatus: record.targetSupport || '',
            notes: `ID: ${record.identifier || ''}\nFamily Size: ${record.familySize || ''}\nNeed: ${record.needDescription || ''}`,
            projectId: '', // Placeholder
          },
        });

        importedCount++;
      } catch (err) {
        errors.push(`Error importing ${record.name}: ${(err as Error).message}`);
      }
    }

    return NextResponse.json(
      {
        importedCount,
        totalAttempted: records.length,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}