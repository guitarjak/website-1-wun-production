import { NextRequest, NextResponse } from 'next/server';
import { generateCertificatePDF } from '@/lib/markupgo-certificate';
import fs from 'fs';
import path from 'path';

interface RequestBody {
  recipientName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  instructor?: string;
  courseCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();

    // Validate required fields
    const required = ['recipientName', 'courseName', 'completionDate', 'certificateId'];
    const missing = required.filter((field) => !body[field as keyof RequestBody]);

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Read certificate template
    const templatePath = path.join(process.cwd(), 'public', 'certificate-template.html');
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Remove Handlebars conditionals for simple replacement
    template = template.replace(/{{#courseCode}}[\s\S]*?{{\/courseCode}}/g, (match) => {
      if (body.courseCode) {
        return match
          .replace('{{#courseCode}}', '')
          .replace('{{/courseCode}}', '');
      }
      return '';
    });

    // Generate certificate PDF
    const result = await generateCertificatePDF(body, template);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate certificate' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        pdfUrl: result.url,
        message: 'Certificate generated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
