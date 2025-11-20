import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * POST /auth/logout
 * Signs out the current user and redirects to login page.
 *
 * This route handler:
 * 1. Creates a Supabase server client
 * 2. Calls signOut() to clear auth cookies
 * 3. Revalidates all paths to update the navbar immediately
 * 4. Redirects to /auth/login
 */
export async function POST() {
  const supabase = await createSupabaseServerClient();

  // Sign out the user (clears auth cookies)
  await supabase.auth.signOut();

  // Revalidate all paths to update the navbar immediately
  revalidatePath('/', 'layout');

  // Redirect to login page
  redirect('/auth/login');
}

/**
 * GET /auth/logout
 * Convenience endpoint that also signs out the user.
 * Redirects to /auth/login.
 *
 * Note: While GET requests should be idempotent, logout is a state-changing
 * operation. For maximum security, consider using POST only. However, this GET
 * endpoint is acceptable for a course platform with internal users.
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();

  // Sign out the user (clears auth cookies)
  await supabase.auth.signOut();

  // Revalidate all paths to update the navbar immediately
  revalidatePath('/', 'layout');

  // Redirect to login page
  redirect('/auth/login');
}
