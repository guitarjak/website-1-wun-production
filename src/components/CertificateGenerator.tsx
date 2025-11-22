'use client';

import { useState } from 'react';
import { downloadCertificate } from '@/lib/markupgo-certificate';

interface CertificateGeneratorProps {
  defaultRecipient?: string;
  defaultCourse?: string;
}

export default function CertificateGenerator({
  defaultRecipient = '',
  defaultCourse = '',
}: CertificateGeneratorProps) {
  const [formData, setFormData] = useState({
    recipientName: defaultRecipient,
    courseName: defaultCourse,
    completionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    certificateId: `CERT-${Date.now()}`,
    instructor: 'Course Team',
    courseCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      const response = await fetch('/api/certificate/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate certificate');
      }

      setPdfUrl(data.pdfUrl);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfUrl) return;

    try {
      const filename = `${formData.recipientName}-Certificate.pdf`.replace(
        /\s+/g,
        '-'
      );
      await downloadCertificate(pdfUrl, filename);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to download certificate'
      );
    }
  };

  return (
    <div className="certificate-generator">
      <div className="generator-wrapper">
        {/* Form Section */}
        <div className="form-section">
          <div className="form-header">
            <h2>Generate Certificate</h2>
            <p>Fill in the details to create a personalized certificate</p>
          </div>

          <form onSubmit={handleGenerateCertificate} className="certificate-form">
            <div className="form-group">
              <label htmlFor="recipientName">Recipient Name *</label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="courseName">Course Name *</label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                placeholder="Enter course name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="courseCode">Course Code</label>
                <input
                  type="text"
                  id="courseCode"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  placeholder="e.g., CS101"
                />
              </div>

              <div className="form-group">
                <label htmlFor="completionDate">Completion Date *</label>
                <input
                  type="date"
                  id="completionDate"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      completionDate: date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }),
                    }));
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="instructor">Instructor Name</label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                placeholder="Instructor name"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                'Generate Certificate'
              )}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        {showPreview && pdfUrl && (
          <div className="preview-section">
            <div className="preview-header">
              <h3>Certificate Preview</h3>
              <button
                className="btn-close"
                onClick={() => setShowPreview(false)}
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            <div className="preview-container">
              <iframe
                src={pdfUrl}
                title="Certificate Preview"
                className="certificate-preview"
              />
            </div>

            <div className="preview-actions">
              <button
                onClick={handleDownload}
                className="btn btn-primary"
              >
                Download PDF
              </button>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Open in New Tab
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .certificate-generator {
          background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }

        .generator-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        /* Form Section */
        .form-section {
          background: white;
          border-radius: 12px;
          border: 1px solid #d4cbc0;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(0, 0, 1, 0.08);
        }

        .form-header {
          margin-bottom: 30px;
        }

        .form-header h2 {
          font-size: 28px;
          font-weight: 800;
          color: #000001;
          margin-bottom: 8px;
        }

        .form-header p {
          font-size: 14px;
          color: #808080;
          line-height: 1.5;
        }

        .certificate-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 600;
          color: #4d4d4d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .form-group input {
          padding: 12px 14px;
          border: 1px solid #d4cbc0;
          border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #000001;
          transition: all 0.2s ease;
          background: #faf8f5;
        }

        .form-group input:focus {
          outline: none;
          border-color: #4a71f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(74, 113, 246, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .error-message {
          padding: 12px 14px;
          background: rgba(239, 68, 68, 0.1);
          border-left: 3px solid #ef4444;
          border-radius: 4px;
          font-size: 13px;
          color: #dc2626;
          font-weight: 500;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary {
          background: #febf00;
          color: #000001;
        }

        .btn-primary:hover:not(:disabled) {
          background: #fcc200;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(254, 191, 0, 0.2);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #4a71f6;
          color: white;
          text-decoration: none;
        }

        .btn-secondary:hover {
          background: #3b5fd4;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(74, 113, 246, 0.2);
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0, 0, 1, 0.2);
          border-top-color: #000001;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Preview Section */
        .preview-section {
          background: white;
          border-radius: 12px;
          border: 1px solid #d4cbc0;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 1, 0.08);
          display: flex;
          flex-direction: column;
          height: fit-content;
          position: sticky;
          top: 40px;
        }

        .preview-header {
          padding: 20px;
          border-bottom: 1px solid #e8e2d5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preview-header h3 {
          font-size: 16px;
          font-weight: 700;
          color: #000001;
          margin: 0;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 20px;
          color: #808080;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .btn-close:hover {
          color: #000001;
        }

        .preview-container {
          padding: 20px;
          flex: 1;
          overflow: hidden;
          background: #f5f0e8;
        }

        .certificate-preview {
          width: 100%;
          height: 400px;
          border: none;
          border-radius: 8px;
          background: white;
        }

        .preview-actions {
          padding: 20px;
          border-top: 1px solid #e8e2d5;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .preview-actions .btn {
          flex: 1;
          min-width: 140px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .generator-wrapper {
            grid-template-columns: 1fr;
          }

          .preview-section {
            position: static;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .certificate-generator {
            padding: 20px 16px;
          }

          .form-section {
            padding: 24px;
          }

          .form-header h2 {
            font-size: 22px;
          }

          .btn {
            width: 100%;
          }

          .preview-actions {
            flex-direction: column;
          }

          .preview-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
