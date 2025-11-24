import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import {
  checkCertificateEligibility,
  getOrCreateCertificateForUser,
} from '@/lib/certificates';
import { CertificateSuccess } from './CertificateSuccess';

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
      <div
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}
      >
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
    <CertificateSuccess
      userName={userName}
      courseTitle={safeCourseTitle}
      certificateNumber={certificate.certificate_number}
    />
  );
}
