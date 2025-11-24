import AdminNav from './AdminNav';
import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}
    >
      {/* Navigation */}
      <AdminNav />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
