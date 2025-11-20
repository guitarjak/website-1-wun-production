import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import {
  checkCertificateEligibility,
  getOrCreateCertificateForUser,
} from '@/lib/certificates';
import { PrintButton } from './PrintButton';

export default async function CertificatePage() {
  const user = await requireUser();

  // Check eligibility and get or create certificate
  const { certificate, courseTitle } = await getOrCreateCertificateForUser(
    user.user.id
  );

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

  // User is eligible - show beautiful certificate
  const certificateDate = new Date(certificate.issued_at);
  const formattedDate = certificateDate.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#efe3d4' }}>
      <div className="max-w-4xl mx-auto">
        {/* Certificate Card */}
        <div data-certificate className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8" style={{ borderColor: 'var(--golden)', borderWidth: '4px' }}>
          {/* Certificate Header */}
          <div className="text-white px-8 sm:px-12 py-8 sm:py-10 text-center" style={{ background: 'var(--golden)' }}>
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">ใบประกาศนียบัตร</h2>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Certificate of Completion
            </p>
          </div>

          {/* Certificate Content */}
          <div className="px-8 sm:px-12 py-12 text-center">
            {/* Title */}
            <div className="mb-8 pb-8" style={{ borderBottom: '2px solid var(--border-light)' }}>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>นี้เพื่อรับรองว่า</p>
              <h3 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {user.profile.full_name}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>ได้ส่วนร่วมอย่างมีความสำเร็จในการเรียน</p>
            </div>

            {/* Course Title */}
            <div className="mb-8">
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>หลักสูตร</p>
              <h4 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: 'var(--golden)' }}>
                {courseTitle}
              </h4>
              <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
                โดยการเรียนจบทุกบทเรียน และส่งการบ้านสำหรับแต่ละโมดูลตามที่กำหนด
              </p>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 my-8 py-8" style={{ borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>เลขที่ใบประกาศนียบัตร</p>
                <p className="text-lg font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                  {certificate.certificate_number}
                </p>
              </div>
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>วันที่ออกใบประกาศนียบัตร</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formattedDate}
                </p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="mt-12">
              <p className="text-xs mb-8" style={{ color: 'var(--text-tertiary)' }}>ออกให้โดย</p>
              <div className="text-2xl font-bold" style={{ color: 'var(--golden)' }}>
                MyCoursePlatform
              </div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Learning Management System</p>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="px-8 sm:px-12 py-4 text-center" style={{ backgroundColor: '#f9fafb' }}>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              ✓ ใบประกาศนียบัตรนี้เป็นสัญญาณของความสำเร็จในการศึกษาอย่างต่อเนื่อง
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 flex-wrap mb-12">
          <PrintButton />
          <Link
            href="/course"
            className="px-6 py-3 font-semibold rounded-lg transition-all hover:opacity-90 text-white"
            style={{ backgroundColor: '#9ca3af' }}
          >
            ← กลับไปเรียนเพิ่มเติม
          </Link>
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center" style={{ borderColor: 'var(--border-light)' }}>
          <p className="mb-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            🌟 แบ่งปันความสำเร็จของคุณให้กับเพื่อนๆ
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button className="px-4 py-2 text-white rounded-lg transition-all hover:opacity-90 text-sm font-semibold" style={{ background: 'var(--blue)' }}>
              📱 แชร์บน Facebook
            </button>
            <button className="px-4 py-2 text-white rounded-lg transition-all hover:opacity-90 text-sm font-semibold" style={{ backgroundColor: '#1DA1F2' }}>
              𝕏 แชร์บน Twitter
            </button>
            <button className="px-4 py-2 text-white rounded-lg transition-all hover:opacity-90 text-sm font-semibold" style={{ backgroundColor: '#1f2937' }}>
              🔗 คัดลอกลิงก์
            </button>
          </div>
        </div>
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
