import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabaseServer';

/**
 * Current authenticated user with auth and profile data
 */
export type CurrentUser = {
  user: {
    id: string;
    email: string | null;
  };
  profile: {
    id: string;
    full_name: string | null;
    role: 'ADMIN' | 'STUDENT';
  };
};

/**
 * Retrieves the current authenticated user along with their profile.
 *
 * @returns {Promise<CurrentUser | null>} The current user with auth and profile data, or null if not authenticated
 * @throws {Error} If profile row doesn't exist for the authenticated user
 *
 * @example
 * ```ts
 * const currentUser = await getCurrentUserWithProfile();
 * if (!currentUser) {
 *   redirect('/auth/login');
 * }
 * console.log(currentUser.user.email, currentUser.profile.role);
 * ```
 */
export async function getCurrentUserWithProfile(): Promise<CurrentUser | null> {
  const supabase = await createSupabaseServerClient();

  // Get the current authenticated user session
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // No session or no user → return null
  if (!authUser) {
    return null;
  }

  // Query users_profile by id = user.id
  const { data: profileData, error: profileError } = await supabase
    .from('users_profile')
    .select('id, full_name, role')
    .eq('id', authUser.id)
    .single();

  // If profile row doesn't exist, throw a clear error
  if (profileError) {
    if (profileError.code === 'PGRST116') {
      throw new Error(
        `User profile not found for authenticated user ${authUser.id}. Profile must exist in users_profile table.`
      );
    }
    throw new Error(`Failed to fetch user profile: ${profileError.message}`);
  }

  // Normalize role to uppercase (ADMIN or STUDENT)
  const normalizedRole = (profileData.role as string).toUpperCase() as
    | 'ADMIN'
    | 'STUDENT';

  return {
    user: {
      id: authUser.id,
      email: authUser.email || null,
    },
    profile: {
      id: profileData.id,
      full_name: profileData.full_name || null,
      role: normalizedRole,
    },
  };
}

/**
 * Ensures the user is logged in. Redirects to /auth/login if not authenticated.
 *
 * @returns {Promise<CurrentUser>} The current authenticated user with profile
 * @throws {RedirectError} Redirects to /auth/login if not logged in
 *
 * @example
 * ```ts
 * export default async function Dashboard() {
 *   const user = await requireUser();
 *   return <div>Welcome {user.profile.full_name}</div>;
 * }
 * ```
 */
export async function requireUser(): Promise<CurrentUser> {
  const currentUser = await getCurrentUserWithProfile();

  if (!currentUser) {
    redirect('/auth/login');
  }

  return currentUser;
}

/**
 * Ensures the user is logged in AND has admin role.
 * Redirects to /auth/login if not authenticated.
 * Redirects to / if authenticated but not an admin.
 *
 * @returns {Promise<CurrentUser>} The current authenticated admin user with profile
 * @throws {RedirectError} Redirects to /auth/login or / if not authorized
 *
 * @example
 * ```ts
 * export default async function AdminPanel() {
 *   const user = await requireAdmin();
 *   return <div>Admin section for {user.profile.full_name}</div>;
 * }
 * ```
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const currentUser = await getCurrentUserWithProfile();

  // Not logged in → redirect to login
  if (!currentUser) {
    redirect('/auth/login');
  }

  // Logged in but not an admin → redirect to home
  if (currentUser.profile.role !== 'ADMIN') {
    redirect('/');
  }

  return currentUser;
}
