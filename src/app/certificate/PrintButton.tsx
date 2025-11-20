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

  const downloadCertificateAsPDF = async () => {
    setIsLoading(true);
    try {
      console.log('🎯 Starting PDF download process...');

      const certificateElement = document.querySelector('[data-certificate]') as HTMLElement;
      if (!certificateElement) {
        console.error('❌ Certificate element not found');
        alert('Certificate not found');
        setIsLoading(false);
        return;
      }

      console.log('✅ Certificate element found');

      // Dynamically import libraries
      console.log('📦 Importing html2canvas...');
      const { default: html2canvas } = await import('html2canvas');
      console.log('✅ html2canvas imported');

      console.log('📦 Importing jsPDF...');
      const { jsPDF } = await import('jspdf');
      console.log('✅ jsPDF imported');

      // Wait for fonts to load
      if (document.fonts) {
        await document.fonts.ready;
      }

      // 16:10 aspect ratio dimensions in mm with padding
      const PADDING = 10; // 10mm padding on all sides
      const CERT_WIDTH = 254; // 10 inches
      const CERT_HEIGHT = 158.75; // 6.25 inches - maintains 16:10 ratio
      const PDF_WIDTH = CERT_WIDTH + (PADDING * 2); // Add padding on both sides
      const PDF_HEIGHT = CERT_HEIGHT + (PADDING * 2); // Add padding on top and bottom

      // Get the actual rendered size of the certificate
      const rect = certificateElement.getBoundingClientRect();

      // High quality settings for canvas
      const canvas = await html2canvas(certificateElement, {
        scale: 3, // High DPI for crisp text (3x scale = ~288 DPI)
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#efe3d4', // Use app's background color for padding
        logging: false,
        windowWidth: rect.width,
        windowHeight: rect.height,
        // Ensure fonts are loaded and all elements are visible
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.querySelector('[data-certificate]') as HTMLElement;
          if (clonedElement) {
            // Force visibility of all elements
            clonedElement.style.opacity = '1';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.animation = 'none';
            clonedElement.style.animationPlayState = 'paused';

            // Force all child elements to be visible
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.opacity = '1';
              htmlEl.style.visibility = 'visible';
              htmlEl.style.animation = 'none';
              htmlEl.style.animationPlayState = 'paused';
            });
          }
        }
      });

      // Create PDF with padding included
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [PDF_WIDTH, PDF_HEIGHT], // Width, Height with padding
        compress: true
      });

      // Add image with padding offset
      const imgWidth = CERT_WIDTH;
      const imgHeight = CERT_HEIGHT;

      // Convert canvas to image
      console.log('🖼️ Converting canvas to image...');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      console.log('✅ Canvas converted');

      // Add image to PDF with padding around it
      console.log('📄 Adding image to PDF...');
      pdf.addImage(imgData, 'JPEG', PADDING, PADDING, imgWidth, imgHeight);
      console.log('✅ Image added to PDF');

      // Save the PDF with automatic download
      const timestamp = new Date().toISOString().split('T')[0];
      console.log(`💾 Saving PDF as certificate-${timestamp}.pdf`);
      pdf.save(`certificate-${timestamp}.pdf`);
      console.log('✅ PDF saved successfully');

    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      console.error('Full error details:', error);
      alert('Failed to download certificate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={downloadCertificateAsPDF}
      disabled={isLoading}
      className={`px-6 py-3 font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-50 ${className}`}
      style={{ background: 'var(--golden)', color: '#000000', ...style }}
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}
