# Integrating MarkUpGo with Your Existing Certificate System

Your project already has a certificate system at `/src/app/certificate/`. This guide shows how to integrate MarkUpGo PDF generation into your existing flow.

## Current Structure

Your existing certificate components:
- `page.tsx` - Main certificate page
- `PublicCertificateContent.tsx` - Public certificate view
- `SimpleCertificateContent.tsx` - Certificate content rendering
- `PrintButton.tsx` - Print functionality
- `ShareCertificateSection.tsx` - Social sharing

## Integration Approaches

### Approach 1: Replace Print with PDF Download (Recommended)

Replace the print functionality with MarkUpGo PDF generation.

**Step 1**: Update your `PrintButton.tsx` to use MarkUpGo

```typescript
'use client';

import { useState } from 'react';
import { downloadCertificate } from '@/lib/markupgo-certificate';

interface PrintButtonProps {
  certificateData: {
    recipientName: string;
    courseName: string;
    completionDate: string;
    certificateId: string;
    instructor?: string;
    courseCode?: string;
  };
}

export default function PrintButton({ certificateData }: PrintButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/certificate/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate certificate');
      }

      // Download the PDF
      const filename = `${certificateData.recipientName}-Certificate.pdf`.replace(
        /\s+/g,
        '-'
      );
      await downloadCertificate(data.pdfUrl, filename);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate certificate'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGeneratePDF}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Generating PDF...' : 'Download Certificate (PDF)'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

**Step 2**: Update your certificate page to pass data to PrintButton

```typescript
// In page.tsx
import PrintButton from '@/components/PrintButton';

export default function CertificatePage() {
  // Your existing code...

  const certificateData = {
    recipientName: student.full_name,
    courseName: course.title,
    completionDate: new Date(completion.completed_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    certificateId: completion.certificate_id,
    instructor: course.instructor_name,
    courseCode: course.code,
  };

  return (
    <>
      {/* Your existing certificate content */}
      <PrintButton certificateData={certificateData} />
      {/* Rest of page */}
    </>
  );
}
```

### Approach 2: Add PDF Download to PublicCertificateContent

Enhance the public certificate viewer with PDF export.

```typescript
// In PublicCertificateContent.tsx, add a download button:

import { downloadCertificate } from '@/lib/markupgo-certificate';

export default function PublicCertificateContent({ certificate, student, course }) {
  const handleDownloadPDF = async () => {
    const certificateData = {
      recipientName: student.full_name,
      courseName: course.title,
      completionDate: new Date(certificate.completed_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      certificateId: certificate.certificate_id,
      instructor: course.instructor_name,
      courseCode: course.code,
    };

    try {
      const response = await fetch('/api/certificate/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const filename = `${student.full_name}-Certificate.pdf`.replace(/\s+/g, '-');
      await downloadCertificate(data.pdfUrl, filename);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF');
    }
  };

  return (
    // Your existing JSX...
    <button onClick={handleDownloadPDF}>
      Download as PDF
    </button>
    // Rest of component
  );
}
```

### Approach 3: Standalone /certificate/generate Page

Use the pre-built page at `/certificate/generate` for admin users to generate certificates manually.

**Typical Use Cases:**
- Manual certificate generation for special cases
- Batch re-issuing certificates
- Testing certificate generation
- Late completions

Access at: `http://localhost:3000/certificate/generate`

## Storing PDF URLs in Database

Track generated certificates in Supabase:

```typescript
// After successful PDF generation
const { data, error } = await supabase
  .from('certificates')
  .update({
    pdf_url: pdfUrl,
    pdf_generated_at: new Date().toISOString(),
  })
  .eq('id', certificateId)
  .select();
```

## Sample Supabase Integration

```typescript
// Function to generate and save certificate
async function generateAndSaveCertificate(
  studentId: string,
  courseId: string,
  completionId: string
) {
  try {
    // Get certificate data from database
    const { data: completion } = await supabase
      .from('course_completions')
      .select(`
        *,
        student:user_id(full_name),
        course:course_id(title, code, instructor_name)
      `)
      .eq('id', completionId)
      .single();

    const certificateData = {
      recipientName: completion.student.full_name,
      courseName: completion.course.title,
      completionDate: new Date(completion.completed_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      certificateId: completion.certificate_id,
      instructor: completion.course.instructor_name,
      courseCode: completion.course.code,
    };

    // Generate PDF
    const response = await fetch('/api/certificate/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificateData),
    });

    const { pdfUrl } = await response.json();

    // Save to database
    await supabase
      .from('certificates')
      .insert({
        student_id: studentId,
        course_id: courseId,
        completion_id: completionId,
        pdf_url: pdfUrl,
        certificate_id: certificateData.certificateId,
        status: 'generated',
      });

    return pdfUrl;
  } catch (error) {
    console.error('Certificate generation failed:', error);
    throw error;
  }
}
```

## Automatic Generation on Course Completion

Trigger certificate generation when students complete a course:

```typescript
// In your course completion handler
export async function handleCourseCompletion(
  studentId: string,
  courseId: string
) {
  // Mark course as complete...
  const { data: completion } = await supabase
    .from('course_completions')
    .insert({
      student_id: studentId,
      course_id: courseId,
      completed_at: new Date().toISOString(),
      certificate_id: `CERT-${Date.now()}`,
    })
    .select()
    .single();

  // Generate certificate automatically
  try {
    await generateAndSaveCertificate(
      studentId,
      courseId,
      completion.id
    );
  } catch (error) {
    // Log error but don't fail the completion
    console.error('Certificate generation error:', error);
  }
}
```

## Environment Variables Checklist

Ensure `.env.local` has:
```
MARKUPGO_API_KEY=your_api_key_here
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Testing the Integration

### Test 1: Manual Generation
1. Navigate to `/certificate/generate`
2. Fill in the form
3. Click "Generate Certificate"
4. Verify PDF preview appears
5. Download and check PDF quality

### Test 2: API Endpoint
```bash
curl -X POST http://localhost:3000/api/certificate/generate \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "John Doe",
    "courseName": "Web Development 101",
    "completionDate": "November 21, 2024",
    "certificateId": "CERT-123456",
    "instructor": "Jane Smith"
  }'
```

### Test 3: Component Integration
Add the component to your existing page and verify:
- Form appears correctly
- Data is submitted properly
- PDF generates successfully
- Download works

## Customization Options

### Change Certificate Design
Edit `public/certificate-template.html`:
- Update colors to match your brand
- Add your logo
- Change layout and text
- Add additional fields

### Modify API Endpoint
Edit `src/app/api/certificate/generate/route.ts`:
- Add authentication checks
- Validate course enrollment
- Log certificate generation
- Add metrics/analytics

### Enhance Frontend Component
Edit `src/components/CertificateGenerator.tsx`:
- Add pre-filled student data
- Add bulk generation
- Add email sending
- Add custom styling

## Performance Considerations

- **Caching**: Cache generated PDFs if same certificate is requested
- **Rate Limiting**: Implement to prevent abuse
- **Async Generation**: Consider generating PDFs async for large batches
- **CDN**: Use MarkUpGo's URL directly (already CDN optimized)

## Troubleshooting Integration Issues

### API Returns 404
- Ensure the route file exists at `src/app/api/certificate/generate/route.ts`
- Restart Next.js dev server

### Missing API Key
- Add `MARKUPGO_API_KEY` to `.env.local`
- Restart dev server after adding env var

### PDF Download Fails
- Check browser console for errors
- Verify CORS settings in MarkUpGo
- Try opening PDF URL directly

### Certificate Data Not Showing
- Verify template placeholders match field names
- Check console for template population errors
- Ensure all required fields are provided

## Next Steps

1. Choose your integration approach (1, 2, or 3)
2. Implement the code from above
3. Test thoroughly
4. Deploy to production
5. Monitor for errors in logs

## Support Resources

- MarkUpGo Docs: https://markupgo.com/docs
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Supabase Docs: https://supabase.com/docs
