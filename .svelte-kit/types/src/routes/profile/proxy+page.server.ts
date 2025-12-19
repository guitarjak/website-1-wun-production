// @ts-nocheck
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

  // Get the first course
  const { data: courses, error: courseError } = await supabase
    .from('courses')
    .select('id')
    .limit(1);

  if (courseError || !courses || courses.length === 0) {
    return {
      profile: locals.profile,
      stats: null
    };
  }

  const course = courses[0];

  // Get modules for the course
  const { data: modules } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', course.id);

  const moduleIds = (modules || []).map((m) => m.id);

  // Parallelize statistics queries
  const [lessonsCountResult, progressResult] = await Promise.all([
    // Get total lessons count
    supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .in('module_id', moduleIds),

    // Get user's completed lessons
    supabase
      .from('lesson_progress')
      .select('lesson_id, completed_at, completed')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
  ]);

  const totalLessons = lessonsCountResult.count || 0;
  const completedLessons = progressResult.data?.length || 0;
  const progressPercentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  // Get most recent activity
  const lastActivity = progressResult.data?.[0]?.completed_at || null;
  const enrolledAt = locals.profile?.created_at || null;

  return {
    profile: locals.profile,
    stats: {
      totalLessons,
      completedLessons,
      progressPercentage,
      lastActivity,
      enrolledAt
    }
  };
};
