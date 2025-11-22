/**
 * MarkUpGo Certificate Generation Examples
 * Copy and adapt these examples for your use cases
 */

/**
 * Example 1: Generate certificate from course completion
 * Call this when a student completes a course
 */
export async function generateCertificateOnCompletion(
  studentName: string,
  courseName: string,
  courseCode?: string,
  instructorName?: string
) {
  const certificateData = {
    recipientName: studentName,
    courseName: courseName,
    completionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    instructor: instructorName || 'Course Team',
    courseCode: courseCode || '',
  };

  const response = await fetch('/api/certificate/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certificateData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Certificate generation failed: ${data.error}`);
  }

  return data.pdfUrl;
}

/**
 * Example 2: Generate and download certificate
 * Use in a button click handler
 */
export async function generateAndDownloadCertificate(
  studentName: string,
  courseName: string,
  completionDate: Date
) {
  try {
    const certificateData = {
      recipientName: studentName,
      courseName: courseName,
      completionDate: completionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      certificateId: `CERT-${Date.now()}`,
    };

    const response = await fetch('/api/certificate/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate certificate');
    }

    const { pdfUrl } = await response.json();

    // Download the PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${studentName}-Certificate.pdf`.replace(/\s+/g, '-');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw error;
  }
}

/**
 * Example 3: Batch generate certificates (Server-side)
 * Use in an API endpoint or server action
 */
export async function batchGenerateCertificates(
  certificates: Array<{
    studentName: string;
    courseName: string;
    completionDate: Date;
    courseCode?: string;
  }>
) {
  const results = [];

  for (const cert of certificates) {
    try {
      const certificateData = {
        recipientName: cert.studentName,
        courseName: cert.courseName,
        completionDate: cert.completionDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        courseCode: cert.courseCode || '',
      };

      const response = await fetch('/api/certificate/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData),
      });

      if (!response.ok) {
        throw new Error(`Failed for ${cert.studentName}`);
      }

      const data = await response.json();
      results.push({
        studentName: cert.studentName,
        success: true,
        pdfUrl: data.pdfUrl,
      });
    } catch (error) {
      results.push({
        studentName: cert.studentName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

/**
 * Example 4: React Hook for certificate generation
 * Use in your React components
 */
export function useCertificateGeneration() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

  const generate = React.useCallback(
    async (certificateData: {
      recipientName: string;
      courseName: string;
      completionDate: string;
      certificateId: string;
      instructor?: string;
      courseCode?: string;
    }) => {
      setLoading(true);
      setError(null);
      setPdfUrl(null);

      try {
        const response = await fetch('/api/certificate/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certificateData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to generate certificate');
        }

        const data = await response.json();
        setPdfUrl(data.pdfUrl);
        return data.pdfUrl;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { generate, loading, error, pdfUrl };
}

/**
 * Example 5: Store certificate in Supabase
 * After generating the PDF, save the URL to your database
 */
export async function saveCertificateToDatabase(
  supabaseClient: any,
  certificateData: {
    student_id: string;
    course_id: string;
    recipient_name: string;
    course_name: string;
    certificate_id: string;
    pdf_url: string;
  }
) {
  const { data, error } = await supabaseClient
    .from('certificates')
    .insert({
      ...certificateData,
      created_at: new Date().toISOString(),
    })
    .select();

  if (error) {
    throw new Error(`Failed to save certificate: ${error.message}`);
  }

  return data[0];
}

/**
 * Example 6: Retrieve certificate from database
 */
export async function getCertificateFromDatabase(
  supabaseClient: any,
  certificateId: string
) {
  const { data, error } = await supabaseClient
    .from('certificates')
    .select('*')
    .eq('certificate_id', certificateId)
    .single();

  if (error) {
    throw new Error(`Failed to retrieve certificate: ${error.message}`);
  }

  return data;
}

/**
 * Example 7: Generate with custom dates
 */
export async function generateCertificateWithCustomDate(
  studentName: string,
  courseName: string,
  completionYear: number,
  completionMonth: number,
  completionDay: number
) {
  const completionDate = new Date(
    completionYear,
    completionMonth - 1,
    completionDay
  );

  const certificateData = {
    recipientName: studentName,
    courseName: courseName,
    completionDate: completionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    certificateId: `CERT-${completionYear}-${completionMonth}-${completionDay}`,
  };

  const response = await fetch('/api/certificate/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certificateData),
  });

  if (!response.ok) {
    throw new Error('Failed to generate certificate');
  }

  return (await response.json()).pdfUrl;
}

/**
 * Example 8: Format student name for certificate
 * Ensures proper capitalization
 */
export function formatStudentNameForCertificate(fullName: string): string {
  return fullName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Example 9: Generate unique certificate ID
 */
export function generateCertificateId(courseId: string, studentId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `CERT-${courseId}-${studentId}-${timestamp}-${random}`.toUpperCase();
}

/**
 * Example 10: Validate certificate data before generation
 */
export function validateCertificateData(data: {
  recipientName?: string;
  courseName?: string;
  completionDate?: string;
  certificateId?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.recipientName || data.recipientName.trim() === '') {
    errors.push('Recipient name is required');
  }

  if (!data.courseName || data.courseName.trim() === '') {
    errors.push('Course name is required');
  }

  if (!data.completionDate || data.completionDate.trim() === '') {
    errors.push('Completion date is required');
  }

  if (!data.certificateId || data.certificateId.trim() === '') {
    errors.push('Certificate ID is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
