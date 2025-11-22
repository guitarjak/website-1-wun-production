import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { requireUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

/**
 * Generates a downloadable PDF certificate for an authenticated user
 * Uses HTML template approach instead of MarkUpGo template IDs
 * POST /api/certificate/download
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const authData = await requireUser();
    const userId = authData.user.id;
    const userName = authData.profile.full_name || 'ผู้เรียน';

    const supabase = await createSupabaseServerClient();

    // Get user's certificate
    const { data: certificates, error: certError } = await supabase
      .from('certificates')
      .select(
        `
        id,
        certificate_number,
        issued_at,
        course_id,
        courses(title, instructor_id, instructors:users_profile(full_name))
      `
      )
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (certError || !certificates) {
      return NextResponse.json(
        { error: 'ไม่พบใบประกาศนียบัตร' },
        { status: 404 }
      );
    }

    const certificate = certificates as any;
    const courseTitle = certificate.courses?.title || 'คอร์สเรียน';
    const instructorName = certificate.courses?.instructors?.full_name || 'Course Team';

    // Format completion date from issued_at
    const completionDate = new Date(certificate.issued_at).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Read certificate template
    const templatePath = path.join(process.cwd(), 'public', 'certificate-template.html');
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Remove Handlebars conditionals for optional fields
    template = template.replace(/{{#courseCode}}[\s\S]*?{{\/courseCode}}/g, (match) => {
      return '';
    });

    // Populate template with certificate data
    const populatedHTML = template
      .replace(/\{\{recipientName\}\}/g, userName)
      .replace(/\{\{courseName\}\}/g, courseTitle)
      .replace(/\{\{completionDate\}\}/g, completionDate)
      .replace(/\{\{certificateId\}\}/g, certificate.certificate_number)
      .replace(/\{\{instructor\}\}/g, instructorName)
      .replace(/\{\{courseCode\}\}/g, '');

    // Call MarkUpGo API to convert HTML to PDF
    const markupgoApiKey = process.env.MARKUPGO_API_KEY;
    if (!markupgoApiKey) {
      return NextResponse.json(
        { error: 'MarkUpGo API key not configured' },
        { status: 500 }
      );
    }

    const markupgoResponse = await fetch('https://api.markupgo.com/api/v1/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': markupgoApiKey,
      },
      body: JSON.stringify({
        source: {
          type: 'html',
          data: populatedHTML,
        },
        options: {
          waitDelay: '2s',
          emulatedMediaType: 'print',
          properties: {
            landscape: true,
            size: {
              width: 1200,
              height: 750,
            },
            margins: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
            printBackground: true,
            preferCssPageSize: true,
          },
        },
      }),
    });

    if (!markupgoResponse.ok) {
      const errorData = await markupgoResponse.json();
      console.error('MarkUpGo API error:', errorData);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้างใบประกาศนียบัตร' },
        { status: 500 }
      );
    }

    const pdfData = await markupgoResponse.json();

    if (!pdfData.url) {
      console.error('MarkUpGo response missing URL:', pdfData);
      return NextResponse.json(
        { error: 'Failed to generate certificate PDF' },
        { status: 500 }
      );
    }

    // Return success with PDF URL
    return NextResponse.json(
      {
        success: true,
        pdfUrl: pdfData.url,
        certificateNumber: certificate.certificate_number,
        fileName: `${userName}-Certificate-${certificate.certificate_number}.pdf`.replace(/\s+/g, '-'),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Certificate download error:', error);

    // Handle authentication errors
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'ต้องเข้าสู่ระบบเพื่อดาวน์โหลดใบประกาศนียบัตร' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
