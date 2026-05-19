import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {

    const beneficiaries = await prisma.beneficiary.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Map beneficiary data to match expected format
    const mappedBeneficiaries = beneficiaries.map(b => ({
      id: b.id,
      name: b.name,
      identifier: b.name,
      phone: '',
      address: b.location || '',
      familySize: 0,
      category: b.typeOfSupport,
      needDescription: b.typeOfSupport,
      priority: 'medium',
      status: 'active',
      registrationDate: b.createdAt,
      assessmentNotes: b.notes || '',
      supportProvided: '',
      targetSupport: b.progressStatus || '',
      createdAt: b.createdAt,
      userId: '',
    }));

    return NextResponse.json({ beneficiaries: mappedBeneficiaries });
  } catch (error) {
    console.error('GET beneficiaries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const {
      name,
      identifier,
      phone,
      address,
      familySize,
      category,
      needDescription,
      priority,
      status,
      registrationDate,
      assessmentNotes,
      supportProvided,
      targetSupport,
    } = body;

    // Create a record combining multiple models to store comprehensive beneficiary data
    // Using Beneficiary model with extended data
    const beneficiary = await prisma.beneficiary.create({
      data: {
        name,
        location: address,
        contact: phone,
        typeOfSupport: category,
        progressStatus: targetSupport,
        notes: `\nID: ${identifier}\nPhone: ${phone}\nFamily Size: ${familySize}\nPriority: ${priority}\nStatus: ${status}\nRegistration Date: ${registrationDate}\n\nNeed Description: ${needDescription}\n\nAssessment Notes: ${assessmentNotes}\n\nSupport Provided: ${supportProvided}\n\nTarget Support: ${targetSupport}`,
        projectId: '', // Placeholder
      },
    });

    const responseData = {
      id: beneficiary.id,
      name: beneficiary.name,
      identifier,
      phone,
      address,
      familySize,
      category,
      needDescription,
      priority,
      status,
      registrationDate,
      assessmentNotes,
      supportProvided,
      targetSupport,
      createdAt: beneficiary.createdAt,
    };

    return NextResponse.json({ beneficiary: responseData }, { status: 201 });
  } catch (error) {
    console.error('POST beneficiary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}