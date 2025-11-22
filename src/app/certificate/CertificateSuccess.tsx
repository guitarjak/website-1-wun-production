'use client';

import { PrintButton } from './PrintButton';
import { ShareCertificateSection } from './ShareCertificateSection';
import Link from 'next/link';

interface CertificateSuccessProps {
  userName: string;
  courseTitle: string;
  certificateNumber: string;
}

export function CertificateSuccess({
  userName,
  courseTitle,
  certificateNumber,
}: CertificateSuccessProps) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#efe3d4' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

        .success-container {
          animation: fadeInScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .confetti {
          position: fixed;
          pointer-events: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: confetti-fall 3s linear forwards;
        }

        @keyframes confetti-fall {
          to {
            opacity: 0;
            transform: translateY(100vh) rotateZ(360deg);
          }
        }

        .pulse-golden {
          animation: pulseGolden 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulseGolden {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .slide-up {
          animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .btn-shine {
          position: relative;
          overflow: hidden;
        }

        .btn-shine::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>

      <div className="max-w-2xl mx-auto success-container">
        {/* Celebration Header */}
        <div className="text-center mb-12">
          {/* Decorative Icons */}
          <div className="flex justify-center gap-4 mb-6 text-5xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎉</span>
            <span className="animate-bounce pulse-golden" style={{ animationDelay: '0.1s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</span>
          </div>

          {/* Main Heading */}
          <h1
            className="slide-up text-5xl sm:text-6xl font-bold mb-4"
            style={{
              fontFamily: '"Playfair Display", serif',
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
            }}
          >
            ยินดีด้วย! 🎓
          </h1>

          <p
            className="slide-up text-xl sm:text-2xl mb-2"
            style={{
              color: '#666666',
              fontFamily: '"Poppins", sans-serif',
              animationDelay: '0.1s',
            }}
          >
            คุณได้รับ{' '}
            <span style={{ color: '#febf00', fontWeight: 'bold' }}>
              ใบประกาศนียบัตร
            </span>
          </p>

          <p
            className="slide-up text-lg"
            style={{
              color: '#999999',
              fontFamily: '"Poppins", sans-serif',
              animationDelay: '0.2s',
            }}
          >
            สำหรับการสำเร็จหลักสูตร
          </p>
        </div>

        {/* Achievement Card */}
        <div
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg mb-10 slide-up"
          style={{
            borderTop: '4px solid #febf00',
            borderLeft: '2px solid #f5f0e8',
            borderRight: '2px solid #f5f0e8',
            borderBottom: '2px solid #f5f0e8',
            animationDelay: '0.3s',
          }}
        >
          {/* Certificate Title - Black text with Yellow background */}
          <div className="mb-8 text-center">
            <div
              style={{
                display: 'inline-block',
                background: '#febf00',
                color: '#000000',
                padding: '12px 32px',
                borderRadius: '20px',
                marginBottom: '24px',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  fontFamily: '"Poppins", sans-serif',
                  margin: 0,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                ใบประกาศนียบัตร
              </p>
            </div>
          </div>

          {/* Student Name */}
          <div className="mb-8 text-center">
            <h2
              style={{
                fontSize: '40px',
                fontWeight: '800',
                color: '#1a1a1a',
                fontFamily: '"Poppins", sans-serif',
                marginBottom: '16px',
              }}
            >
              {userName}
            </h2>
            <div
              style={{
                height: '3px',
                width: '80px',
                background: '#febf00',
                margin: '0 auto',
                borderRadius: '2px',
              }}
            />
          </div>

          {/* Course & Certificate Details - All Centered */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            {/* Course Title */}
            <p
              style={{
                fontSize: '14px',
                color: '#999999',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              คอร์สเรียน
            </p>
            <p
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a1a1a',
                fontFamily: '"Poppins", sans-serif',
                marginBottom: '24px',
              }}
            >
              {courseTitle}
            </p>

            {/* Certificate Number */}
            <p
              style={{
                fontSize: '12px',
                color: '#999999',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              เลขที่ใบประกาศ
            </p>
            <p
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#febf00',
                fontFamily: '"Courier New", monospace',
              }}
            >
              {certificateNumber}
            </p>
          </div>

          {/* Achievement Statement */}
          <div
            className="border-t-2 pt-6"
            style={{ borderColor: '#f5f0e8' }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#666666',
                lineHeight: '1.6',
                fontFamily: '"Poppins", sans-serif',
                textAlign: 'center',
              }}
            >
              ขอยืนยันว่าคุณได้สำเร็จการศึกษาและพร้อมที่จะนำความรู้มาประยุกต์ใช้ได้อย่างมีประสิทธิภาพ
            </p>
          </div>
        </div>

        {/* Download & Share Section */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {/* Download Button - Centered with target="_blank" */}
          <div className="slide-up mb-6" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/certificate/download', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.error || 'Failed to generate certificate');
                    return;
                  }

                  const data = await response.json();
                  if (data.pdfUrl) {
                    window.open(data.pdfUrl, '_blank');
                  }
                } catch (error) {
                  console.error('Error:', error);
                  alert('Failed to download certificate');
                }
              }}
              style={{
                background: '#febf00',
                color: '#000000',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                fontFamily: '"Poppins", sans-serif',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              📥 ดาวน์โหลดใบประกาศนียบัตร
            </button>
          </div>

          {/* Share Section */}
          <div className="slide-up" style={{ animationDelay: '0.5s' }}>
            <ShareCertificateSection
              certificateNumber={certificateNumber}
              userName={userName}
              courseTitle={courseTitle}
            />
          </div>
        </div>

        {/* Back to Course Button */}
        <div className="text-center slide-up" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/course"
            className="inline-block px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 text-white"
            style={{
              backgroundColor: '#1a1a1a',
              color: '#ffffff !important',
            }}
          >
            ← กลับไปเรียนเพิ่มเติม
          </Link>
        </div>
      </div>
    </div>
  );
}
