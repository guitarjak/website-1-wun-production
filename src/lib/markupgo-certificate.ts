/**
 * MarkUpGo Certificate Generation Service
 * Handles PDF certificate generation using MarkUpGo API
 */

interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  instructor?: string;
  courseCode?: string;
}

interface MarkUpGoResponse {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Generates a certificate PDF using MarkUpGo API
 * @param data - Certificate data to populate the template
 * @param htmlTemplate - HTML template string
 * @returns Promise with the PDF URL or error
 */
export async function generateCertificatePDF(
  data: CertificateData,
  htmlTemplate: string
): Promise<MarkUpGoResponse> {
  try {
    const apiKey = process.env.MARKUPGO_API_KEY;

    if (!apiKey) {
      throw new Error('MARKUPGO_API_KEY environment variable is not set');
    }

    // Populate template with certificate data
    const populatedHTML = populateCertificateTemplate(htmlTemplate, data);

    // Call MarkUpGo API to convert HTML to PDF
    const response = await fetch('https://api.markupgo.com/api/v1/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        source: {
          type: 'html',
          data: populatedHTML,
        },
        options: {
          format: 'a4',
          landscape: false,
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`MarkUpGo API error: ${errorData.message || response.statusText}`);
    }

    const data_response = await response.json();

    return {
      success: true,
      url: data_response.url,
    };
  } catch (error) {
    console.error('Certificate generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Populates certificate HTML template with data
 * @param template - HTML template with placeholders
 * @param data - Certificate data
 * @returns Populated HTML string
 */
function populateCertificateTemplate(template: string, data: CertificateData): string {
  let html = template;

  // Replace placeholders with actual data
  html = html.replace(/\{\{recipientName\}\}/g, data.recipientName);
  html = html.replace(/\{\{courseName\}\}/g, data.courseName);
  html = html.replace(/\{\{completionDate\}\}/g, data.completionDate);
  html = html.replace(/\{\{certificateId\}\}/g, data.certificateId);
  html = html.replace(/\{\{instructor\}\}/g, data.instructor || 'Course Team');
  html = html.replace(/\{\{courseCode\}\}/g, data.courseCode || '');

  return html;
}

/**
 * Downloads the certificate PDF from the URL
 * @param pdfUrl - URL of the generated PDF
 * @param filename - Desired filename for download
 */
export async function downloadCertificate(pdfUrl: string, filename: string): Promise<void> {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'certificate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}
