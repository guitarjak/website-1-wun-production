import AdminNav from './AdminNav';
import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#efe3d4' }}>
      {/* Navigation */}
      <AdminNav userName={user.profile.full_name || 'Admin'} />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
