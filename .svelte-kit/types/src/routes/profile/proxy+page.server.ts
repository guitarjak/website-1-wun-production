// @ts-nocheck
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

let cachedTotalLessons: { value: number; expiresAt: number } | null = null;

export const load = async ({ locals, setHeaders }: Parameters<PageServerLoad>[0]) => {
  if (!locals.session) {
    throw redirect(303, '/login');
  }

  const supabase = locals.supabase;
  const userId = locals.session.user.id;

  // Cache for 2 minutes to improve performance
  setHeaders({
    'cache-control': 'private, max-age=120, stale-while-revalidate=30'
  });

  const now = Date.now();
  const totalLessonsPromise =
    cachedTotalLessons && cachedTotalLessons.expiresAt > now
      ? Promise.resolve(cachedTotalLessons.value)
      : supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .then((result) => {
            const total = result.count || 0;
            cachedTotalLessons = {
              value: total,
              expiresAt: now + 60_000
            };
            return total;
          });

  const [profileResult, totalLessons, progressResult] = await Promise.all([
    supabase
      .from('users_profile')
      .select('id, email, full_name, role, created_at')
      .eq('id', userId)
      .maybeSingle(),
    totalLessonsPromise,
    supabase
      .from('lesson_progress')
      .select('lesson_id, completed_at, completed')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
  ]);

  if (profileResult.error) {
    throw error(500, 'Failed to load profile');
  }

  const completedLessons = progressResult.data?.length || 0;
  const progressPercentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  // Get most recent activity
  const lastActivity = progressResult.data?.[0]?.completed_at || null;
  const enrolledAt = profileResult.data?.created_at || null;

  return {
    profile: profileResult.data ?? null,
    stats: {
      totalLessons,
      completedLessons,
      progressPercentage,
      lastActivity,
      enrolledAt
    }
  };
};
