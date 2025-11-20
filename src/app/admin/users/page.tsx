import { requireAdmin } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import UserTable from './UserTable';

type User = {
  userId: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  is_active: boolean;
};

async function fetchUsers(): Promise<User[]> {
  const supabase = await createSupabaseServerClient();

  // Fetch all users_profile rows (including email that's now stored in the table)
  const { data: profiles, error: profileError } = await supabase
    .from('users_profile')
    .select('id, email, full_name, role, created_at, is_active')
    .order('created_at', { ascending: false });

  if (profileError) {
    throw new Error(`Failed to fetch user profiles: ${profileError.message}`);
  }

  if (!profiles || profiles.length === 0) {
    return [];
  }

  // Map profiles to User format
  const typedProfiles = profiles as Array<{ id: string; email: string | null; full_name: string | null; role: string; created_at: string; is_active: boolean }>;
  const users: User[] = typedProfiles.map((profile) => ({
    userId: profile.id,
    email: profile.email || '',
    full_name: profile.full_name,
    role: profile.role,
    created_at: profile.created_at,
    is_active: profile.is_active,
  }));

  return users;
}

export default async function AdminUsersPage() {
  // Ensure user is admin
  await requireAdmin();

  const users = await fetchUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">จัดการผู้ใช้</h1>
          <p className="text-gray-600">
            มีผู้ใช้ทั้งหมด {users.length} คน
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              ไม่พบผู้ใช้ในระบบ
            </div>
          ) : (
            <UserTable users={users} />
          )}
        </div>
      </div>
    </div>
  );
}
