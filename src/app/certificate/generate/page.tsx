import CertificateGenerator from '@/components/CertificateGenerator';

export const metadata = {
  title: 'Generate Certificate | Website 1 Wun',
  description: 'Generate and download professional course completion certificates',
};

export default function GenerateCertificatePage() {
  return (
    <main>
      <CertificateGenerator />
    </main>
  );
}
