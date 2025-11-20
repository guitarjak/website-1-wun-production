import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { SimpleCertificateContent } from '../../certificate/SimpleCertificateContent';

export default async function ViewCertificatePage({
  params,
}: {
  params: Promise<{ certificateNumber: string }>;
}) {
  type CertificateData = {
    id: string;
    certificate_number: string;
    issued_at: string;
    user_id: string;
    course_id: string;
    // Supabase returns related rows as arrays
    users_profile: { full_name: string | null }[] | null;
    courses: { title: string | null }[] | null;
  };
  // Unwrap the params promise
  const { certificateNumber } = await params;

  // Use public client for unauthenticated access
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch certificate data by certificate number (public data only)
  const { data: certificates, error } = await supabase
    .from('certificates')
    .select(
      `
      id,
      certificate_number,
      issued_at,
      user_id,
      course_id,
      users_profile:users_profile!certificates_user_id_fkey (
        full_name
      ),
      courses:courses!certificates_course_id_fkey (
        title
      )
    `
    )
    .eq('certificate_number', certificateNumber)
    .limit(1)
    .single();

  if (error || !certificates) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#efe3d4' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Certificate Not Found
          </h1>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            The certificate you&apos;re looking for doesn&apos;t exist or the link is invalid.
          </p>
          <Link
            href="/"
            className="px-6 py-3 font-semibold rounded-lg transition-all text-white"
            style={{ backgroundColor: 'var(--golden)' }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const certificate = certificates as CertificateData;
  const userName = certificate.users_profile?.[0]?.full_name || 'Unknown';
  const courseTitle = certificate.courses?.[0]?.title || 'Unknown Course';

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
        {/* Certificate Only - No Actions or Share */}
        <SimpleCertificateContent
          certificate={certificate}
          userName={userName}
          courseTitle={courseTitle}
        />

        {/* Invitation Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8 text-center" style={{ borderColor: 'var(--border-light)' }}>
          <p className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Want to earn your own certificate? 🎓
          </p>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Join <span style={{ color: 'var(--golden)', fontWeight: '600' }}>{courseTitle}</span> and complete all lessons and homework to earn your certificate of completion!
          </p>
          <Link
            href="/course"
            className="inline-block px-8 py-4 font-semibold rounded-lg transition-all text-white text-lg"
            style={{ backgroundColor: 'var(--golden)', color: '#000000' }}
          >
            Start Learning Now →
          </Link>
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
          nav {
            display: none !important;
          }
          body > div {
            min-height: auto !important;
            padding: 20px !important;
            background: white !important;
          }
          body > div > div > div:first-child {
            display: none !important;
          }
          body > div > div > div:last-child {
            display: none !important;
          }
          [data-certificate] {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 20px !important;
            width: 100% !important;
          }
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
