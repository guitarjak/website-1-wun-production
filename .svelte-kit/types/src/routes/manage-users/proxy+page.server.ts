// @ts-nocheck
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ locals, setHeaders }: Parameters<PageServerLoad>[0]) => {
  // Require admin access
  if (!locals.session || !locals.profile || locals.profile.role !== 'admin') {
    throw redirect(303, '/login');
  }

  const supabase = locals.supabase;

  // Cache for 5 minutes to improve performance
  setHeaders({
    'cache-control': 'private, max-age=300, stale-while-revalidate=60'
  });

  // Step 1: Get course first (needed for subsequent queries)
  const { data: courses, error: courseError } = await supabase
    .from('courses')
    .select('id')
    .limit(1);

  if (courseError) {
    console.error('Error fetching course:', courseError);
    throw error(500, 'Failed to load course: ' + courseError.message);
  }

  if (!courses || courses.length === 0) {
    throw error(404, 'No courses found');
  }

  const course = courses[0];

  // Step 2: First get modules to know which lessons to count
  const { data: modules } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', course.id);

  const moduleIds = (modules || []).map((m) => m.id);

  // Step 3: Parallelize all remaining queries now that we have moduleIds
  const [usersResult, lessonsCountResult, progressResult] = await Promise.all([
    // Get all users from users_profile
    supabase
      .from('users_profile')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false }),

    // Get all lessons count for this course
    supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .in('module_id', moduleIds),

    // Get lesson progress for all users
    supabase
      .from('lesson_progress')
      .select('user_id, lesson_id, completed, completed_at')
      .eq('completed', true)
  ]);

  // Handle errors
  if (usersResult.error) {
    console.error('Error fetching users:', usersResult.error);
    throw error(500, 'Failed to load users');
  }

  const users = usersResult.data;
  const totalLessons = lessonsCountResult.count || 0;
  const allProgress = progressResult.data;

  // Build a map of user progress
  const progressMap = new Map<string, { completedLessons: number; lastActivity: string | null }>();

  (allProgress || []).forEach((progress) => {
    if (!progressMap.has(progress.user_id)) {
      progressMap.set(progress.user_id, { completedLessons: 0, lastActivity: null });
    }
    const userProgress = progressMap.get(progress.user_id)!;
    userProgress.completedLessons += 1;

    // Track most recent activity
    if (!userProgress.lastActivity || progress.completed_at > userProgress.lastActivity) {
      userProgress.lastActivity = progress.completed_at;
    }
  });

  // Combine user data with progress (no enrollments table, use created_at as enrolledAt)
  const usersWithProgress = (users || []).map((user) => {
    const progress = progressMap.get(user.id) || { completedLessons: 0, lastActivity: null };
    const progressPercentage = totalLessons && totalLessons > 0
      ? Math.round((progress.completedLessons / totalLessons) * 100)
      : 0;

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      createdAt: user.created_at,
      enrolledAt: user.created_at, // Use account creation as enrollment date
      completedLessons: progress.completedLessons,
      totalLessons: totalLessons || 0,
      progressPercentage,
      lastActivity: progress.lastActivity
    };
  });

  return {
    users: usersWithProgress,
    totalLessons: totalLessons || 0
  };
};
