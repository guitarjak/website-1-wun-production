'use client';

import Link from 'next/link';
import { PrintButton } from './PrintButton';

export function PublicCertificateContent({
  certificate,
  userName,
  courseTitle,
}: {
  certificate: {
    certificate_number: string;
    issued_at: string;
  };
  userName: string;
  courseTitle: string;
}) {
  const certificateDate = new Date(certificate.issued_at);
  const formattedDate = certificateDate.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto cert-container">
      {/* Certificate Card */}
      <div data-certificate className="relative overflow-hidden mb-8 w-full rounded-2xl shadow-2xl" style={{
        aspectRatio: '16 / 10',
        background: 'white',
        border: '4px solid var(--golden)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(254, 191, 0, 0.2)',
        position: 'relative'
      }}>

        {/* Decorative Corner Elements */}
        <div className="cert-accent" style={{ top: '20px', left: '20px', width: '35px', height: '35px', borderTop: '2px solid var(--golden)', borderLeft: '2px solid var(--golden)' }}></div>
        <div className="cert-accent" style={{ top: '20px', right: '20px', width: '35px', height: '35px', borderTop: '2px solid var(--golden)', borderRight: '2px solid var(--golden)' }}></div>
        <div className="cert-accent" style={{ bottom: '20px', left: '20px', width: '35px', height: '35px', borderBottom: '2px solid var(--golden)', borderLeft: '2px solid var(--golden)' }}></div>
        <div className="cert-accent" style={{ bottom: '20px', right: '20px', width: '35px', height: '35px', borderBottom: '2px solid var(--golden)', borderRight: '2px solid var(--golden)' }}></div>

        {/* Main Content */}
        <div className="flex flex-col justify-between h-full px-8 sm:px-12 py-8 sm:py-10 text-center relative z-10">

          {/* Header Section */}
          <div>
            <div className="cert-header-accent mb-3"></div>
            <p style={{
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              fontFamily: 'Poppins, sans-serif',
              margin: '0',
              fontWeight: '500',
              backgroundColor: 'var(--golden)',
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '20px'
            }}>
              Certificate of Completion
            </p>
          </div>

          {/* Main Content */}
          <div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginBottom: '8px',
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '0.02em'
            }}>
              This certifies that
            </p>

            <h3 className="cert-name" style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: '800',
              color: '#000000',
              marginBottom: '12px',
              letterSpacing: '0.02em'
            }}>
              {userName}
            </h3>

            <p style={{
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontFamily: 'Poppins, sans-serif',
              maxWidth: '700px',
              margin: '0 auto 12px',
              marginBottom: '12px',
              lineHeight: '1.4',
              wordSpacing: '0.1em',
              letterSpacing: '0.01em'
            }}>
              has successfully completed the course
            </p>

            <div style={{
              background: 'var(--bg-secondary)',
              border: '2px solid var(--border-light)',
              borderRadius: '6px',
              padding: '10px 20px',
              marginBottom: '12px'
            }}>
              <p style={{
                color: '#000000',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.15rem',
                fontWeight: '700',
                margin: '0'
              }}>
                {courseTitle}
              </p>
            </div>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '0.01em'
            }}>
              Demonstrating mastery of all lessons and completion of required coursework
            </p>
          </div>

          {/* Footer Section */}
          <div>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div style={{ borderTop: '2px solid var(--border-light)', paddingTop: '8px' }}>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.65rem',
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  margin: '0 0 4px 0'
                }}>
                  Certificate Number
                </p>
                <p style={{
                  color: 'var(--golden)',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  fontWeight: '600',
                  letterSpacing: '0.03em',
                  margin: '0'
                }}>
                  {certificate.certificate_number}
                </p>
              </div>
              <div style={{ borderTop: '2px solid var(--border-light)', paddingTop: '8px' }}>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.65rem',
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  margin: '0 0 4px 0'
                }}>
                  Date of Issuance
                </p>
                <p style={{
                  color: 'var(--golden)',
                  fontSize: '0.8rem',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600',
                  margin: '0'
                }}>
                  {formattedDate}
                </p>
              </div>
            </div>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.7rem',
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '2px',
              fontWeight: '500',
              margin: '0 0 2px 0'
            }}>
              Issued by
            </p>
            <p style={{
              color: '#000000',
              fontSize: '1rem',
              fontFamily: 'serif',
              fontWeight: '400',
              margin: '0',
              fontStyle: 'italic',
              lineHeight: '1.6'
            }}>
              Jakkrapat Ampring
              <br />
              Owner of Website 1 Wun
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 flex-wrap mb-12">
        <PrintButton
          label="📥 Download Certificate"
          loadingLabel="⏳ Creating PDF..."
        />
        <Link
          href="/"
          className="px-6 py-3 font-semibold rounded-lg transition-all hover:opacity-90 text-white"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
        >
          ← Back to Home
        </Link>
      </div>

      {/* Share Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center" style={{ borderColor: 'var(--border-light)' }}>
        <p className="mb-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          🌟 Share this certificate
        </p>
        <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Anyone with this link can view this certificate without logging in.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => {
              const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
              const shareUrl = `${baseUrl}/view-certificate/${certificate.certificate_number}`;
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                'facebook-share-dialog',
                'width=800,height=600'
              );
            }}
            className="px-4 py-2 text-white rounded-lg transition-all hover:opacity-90 text-sm font-semibold"
            style={{ background: 'var(--blue)' }}
          >
            📱 Share on Facebook
          </button>
          <button
            onClick={() => {
              const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
              const shareUrl = `${baseUrl}/view-certificate/${certificate.certificate_number}`;
              const text = `${userName} completed ${courseTitle}! 🎉 Check out the certificate:`;
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
                'twitter-share-dialog',
                'width=800,height=600'
              );
            }}
            className="px-4 py-2 text-white rounded-lg transition-all hover:opacity-90 text-sm font-semibold"
            style={{ backgroundColor: '#1DA1F2' }}
          >
            𝕏 Share on Twitter
          </button>
          <button
            onClick={() => {
              const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
              const shareUrl = `${baseUrl}/view-certificate/${certificate.certificate_number}`;
              navigator.clipboard.writeText(shareUrl);
              alert('Certificate link copied to clipboard!');
            }}
            className="px-4 py-2 text-white rounded-lg transition-all hover:opacity-90 text-sm font-semibold"
            style={{ backgroundColor: '#1f2937' }}
          >
            🔗 Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
