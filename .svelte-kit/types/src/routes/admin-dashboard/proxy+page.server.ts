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

  // Get course first
  const { data: courses } = await supabase
    .from('courses')
    .select('id')
    .limit(1);

  const course = courses?.[0];
  let moduleIds: string[] = [];

  if (course) {
    const { data: modules } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', course.id);

    moduleIds = (modules || []).map((m) => m.id);
  }

  // Parallelize remaining queries
  const [userCountResult, courseCountResult, lessonCountResult, progressResult] = await Promise.all([
    supabase
      .from('users_profile')
      .select('*', { count: 'exact', head: true }),

    supabase
      .from('courses')
      .select('*', { count: 'exact', head: true }),

    moduleIds.length > 0
      ? supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .in('module_id', moduleIds)
      : Promise.resolve({ count: 0 }),

    moduleIds.length > 0
      ? supabase
          .from('lesson_progress')
          .select('user_id, completed')
          .eq('completed', true)
      : Promise.resolve({ data: [] })
  ]);

  const userCount = userCountResult.count || 0;
  const courseCount = courseCountResult.count || 0;
  const lessonCount = lessonCountResult.count || 0;

  // Calculate average completion percentage
  let avgCompletion = 0;
  if (userCount > 0 && lessonCount > 0) {
    const progressData = progressResult.data || [];
    // Group completions by user
    const userCompletions = new Map<string, number>();
    progressData.forEach((p: { user_id: string }) => {
      userCompletions.set(p.user_id, (userCompletions.get(p.user_id) || 0) + 1);
    });
    // Average across all users
    let totalPercentage = 0;
    userCompletions.forEach((completed) => {
      totalPercentage += Math.round((completed / lessonCount) * 100);
    });
    avgCompletion = userCount > 0 ? Math.round(totalPercentage / userCount) : 0;
  }

  return {
    profile: locals.profile,
    userCount,
    courseCount,
    lessonCount,
    avgCompletion
  };
};
