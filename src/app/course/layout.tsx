import { requireUser } from '@/lib/auth';

export default async function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect this route - redirects to /auth/login if not logged in
  await requireUser();

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#efe3d4' }}>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
