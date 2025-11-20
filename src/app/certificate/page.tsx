import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import {
  checkCertificateEligibility,
  getOrCreateCertificateForUser,
} from '@/lib/certificates';
import { PrintButton } from './PrintButton';
import { SimpleCertificateContent } from './SimpleCertificateContent';
import { ShareCertificateSection } from './ShareCertificateSection';

export default async function CertificatePage() {
  const user = await requireUser();

  // Check eligibility and get or create certificate
  const { certificate, courseTitle } = await getOrCreateCertificateForUser(
    user.user.id
  );
  const userName = user.profile.full_name ?? 'ผู้เรียน';
  const safeCourseTitle = courseTitle ?? 'คอร์สเรียนของคุณ';

  // If not eligible, show eligibility requirements
  if (!certificate) {
    const eligibility = await checkCertificateEligibility(user.user.id);
    console.log('Certificate eligibility:', eligibility);

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#efe3d4' }}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-in fade-in">📜</div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              ใบประกาศนียบัตร
            </h1>
            <p className="text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
              คุณยังไม่สามารถรับใบประกาศนียบัตรได้
            </p>
          </div>

          {/* Requirements Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8" style={{ borderColor: 'var(--border-light)' }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              เพื่อให้คุณสมควรรับใบประกาศนียบัตร คุณต้อง:
            </h2>

            <div className="space-y-6">
              {/* Lessons Requirement */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                  style={{
                    background: eligibility.missingLessonsCount === 0 ? '#10b981' : '#ef4444',
                  }}
                >
                  {eligibility.missingLessonsCount === 0 ? '✓' : '✕'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                    1. เรียนจบทุกบทเรียน
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    เสร็จสิ้น{' '}
                    <span className="font-bold">
                      {eligibility.totalLessonsCount - eligibility.missingLessonsCount}/{eligibility.totalLessonsCount}
                    </span>{' '}
                    บทเรียน
                  </p>
                  {eligibility.missingLessonsCount > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: 'var(--golden)',
                            width: `${
                              ((eligibility.totalLessonsCount -
                                eligibility.missingLessonsCount) /
                                eligibility.totalLessonsCount) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                        ยังคงต้องเรียนเพิ่มเติม{' '}
                        <span className="font-semibold" style={{ color: '#ef4444' }}>
                          {eligibility.missingLessonsCount} บทเรียน
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Homework Requirement */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                  style={{
                    background: eligibility.missingModulesCount === 0 ? '#10b981' : '#ef4444',
                  }}
                >
                  {eligibility.missingModulesCount === 0 ? '✓' : '✕'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                    2. ส่งการบ้านอย่างน้อย 1 ครั้งสำหรับแต่ละโมดูล
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    ส่งการบ้านแล้ว{' '}
                    <span className="font-bold">
                      {eligibility.totalModulesCount - eligibility.missingModulesCount}/{eligibility.totalModulesCount}
                    </span>{' '}
                    โมดูล
                  </p>
                  {eligibility.missingModulesCount > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: 'var(--golden)',
                            width: `${
                              ((eligibility.totalModulesCount -
                                eligibility.missingModulesCount) /
                                eligibility.totalModulesCount) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                        ยังคงต้องส่งการบ้าน{' '}
                        <span className="font-semibold" style={{ color: '#ef4444' }}>
                          {eligibility.missingModulesCount} โมดูล
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center">
            <Link
              href="/course"
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
              style={{
                background: 'var(--golden)',
                color: 'white',
              }}
            >
              ← กลับไปเรียน
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#efe3d4' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .cert-container {
          animation: slideInCert 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideInCert {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .cert-accent {
          position: absolute;
          opacity: 0.15;
        }

        .cert-header-accent {
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
          height: 2px;
        }

        .cert-name {
          animation: fadeInName 1.2s ease-out 0.4s both;
          letter-spacing: 0.02em;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }

        @keyframes fadeInName {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        [data-certificate] {
          aspect-ratio: 16 / 10;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          box-sizing: border-box;
          opacity: 1 !important;
          visibility: visible !important;
          overflow: visible;
          width: 100%;
          max-width: 100%;
        }

        [data-certificate] * {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        [data-certificate] h1,
        [data-certificate] h2,
        [data-certificate] h3,
        [data-certificate] p {
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        @media print {
          @page {
            size: 254mm 158.75mm;
            margin: 0;
          }

          html, body {
            width: 254mm;
            height: 158.75mm;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }

          .cert-name {
            animation: none !important;
            opacity: 1 !important;
          }

          [data-certificate] {
            width: 100% !important;
            height: 100% !important;
            page-break-inside: avoid !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
            position: relative;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto cert-container">
        <SimpleCertificateContent
          certificate={certificate}
          userName={userName}
          courseTitle={safeCourseTitle}
        />

        {/* Actions */}
        <div className="flex justify-center gap-4 flex-wrap mb-12">
          <PrintButton />
          <Link
            href="/course"
            className="px-6 py-3 font-semibold rounded-lg transition-all hover:opacity-90 text-white"
            style={{ backgroundColor: '#000000', color: '#ffffff' }}
          >
            ← กลับไปเรียนเพิ่มเติม
          </Link>
        </div>

        {/* Share Section */}
        <ShareCertificateSection
          certificateNumber={certificate.certificate_number}
          userName={userName}
          courseTitle={safeCourseTitle}
        />
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          * {
            margin: 0 !important;
            padding: 0 !important;
          }
          html, body {
            width: 100%;
            height: 100%;
            background: white !important;
          }
          /* Hide navbar */
          nav {
            display: none !important;
          }
          /* Hide main wrapper and reset it */
          body > div {
            min-height: auto !important;
            padding: 20px !important;
            background: white !important;
          }
          /* Hide celebration header */
          body > div > div > div:first-child {
            display: none !important;
          }
          /* Hide action buttons section */
          body > div > div > div:last-child {
            display: none !important;
          }
          /* Show certificate full size */
          [data-certificate] {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 20px !important;
            width: 100% !important;
          }
          /* Hide share section and other content after certificate */
          [data-certificate] ~ div {
            display: none !important;
          }
          @page {
            margin: 10mm;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
