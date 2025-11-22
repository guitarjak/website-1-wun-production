'use client';

import { CSSProperties, useState } from 'react';

type PrintButtonProps = {
  label?: string;
  loadingLabel?: string;
  className?: string;
  style?: CSSProperties;
};

export function PrintButton({
  label = '📥 ดาวน์โหลดใบประกาศนียบัตร',
  loadingLabel = '⏳ กำลังสร้าง PDF...',
  className = '',
  style = {},
}: PrintButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadCertificateAsPDF = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🎯 Calling certificate download API...');

      // Call the new MarkUpGo API endpoint
      const response = await fetch('/api/certificate/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate certificate');
      }

      const data = await response.json();
      console.log('✅ Certificate PDF generated:', data);

      // Download the PDF from the URL
      if (!data.pdfUrl) {
        throw new Error('No PDF URL returned from server');
      }

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = data.pdfUrl;
      link.download = data.fileName || 'certificate.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ PDF downloaded successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download certificate. Please try again.';
      console.error('❌ Error downloading PDF:', error);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={downloadCertificateAsPDF}
        disabled={isLoading}
        className={`px-6 py-3 font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-50 ${className}`}
        style={{ background: 'var(--golden)', color: '#000000', ...style }}
      >
        {isLoading ? loadingLabel : label}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
