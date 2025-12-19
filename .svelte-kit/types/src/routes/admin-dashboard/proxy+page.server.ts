// @ts-nocheck
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ locals, setHeaders }: Parameters<PageServerLoad>[0]) => {
  if (!locals.session) {
    throw redirect(303, '/login');
  }

  if (locals.profile?.role !== 'admin') {
    throw error(403, 'Access denied. Admin privileges required.');
  }

  const supabase = locals.supabase;

  // Cache for 5 minutes to improve performance
  setHeaders({
    'cache-control': 'private, max-age=300, stale-while-revalidate=60'
  });

  // Get total user count
  const { count: userCount } = await supabase
    .from('users_profile')
    .select('*', { count: 'exact', head: true });

  return {
    profile: locals.profile,
    userCount: userCount || 0
  };
};
