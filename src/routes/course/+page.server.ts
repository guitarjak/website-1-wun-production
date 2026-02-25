import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Module } from '../../../app.d';

type CachedCourseContent = {
  course: {
    id: string;
    title: string;
    description: string | null;
  };
  modules: Module[];
  totalLessons: number;
  expiresAt: number;
};

let cachedCourseContent: CachedCourseContent | null = null;

async function getCachedCourseContent(supabase: App.Locals['supabase']) {
  const now = Date.now();
  if (cachedCourseContent && cachedCourseContent.expiresAt > now) {
    return cachedCourseContent;
  }

  // Load the first course (since there's no slug field, we'll get the first one)
  const { data: courses, error: courseError } = await supabase
    .from('courses')
    .select('id, title, description')
    .limit(1);

  if (courseError) {
    console.error('Error fetching course:', courseError);
    throw error(500, 'Failed to load course: ' + courseError.message);
  }

  if (!courses || courses.length === 0) {
    throw error(404, 'No courses found');
  }

  const course = courses[0];

  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, title, description, order')
    .eq('course_id', course.id)
    .order('order', { ascending: true });

  if (modulesError) {
    throw error(500, 'Failed to load modules');
  }

  const moduleIds = (modules || []).map((m) => m.id);

  // Load published lessons (with fallback if is_published column doesn't exist yet)
  let lessons: any[] | null = null;

  const publishedResult = await supabase
    .from('lessons')
    .select('id, module_id, title, order, video_embed, content')
    .in('module_id', moduleIds)
    .eq('is_published', true)
    .order('order', { ascending: true });

  if (publishedResult.error) {
    const fallbackResult = await supabase
      .from('lessons')
      .select('id, module_id, title, order, video_embed, content')
      .in('module_id', moduleIds)
      .order('order', { ascending: true });

    if (fallbackResult.error) {
      throw error(500, 'Failed to load lessons');
    }
    lessons = fallbackResult.data;
  } else {
    lessons = publishedResult.data;
  }

  const modulesWithLessons: Module[] = modules.map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    position: module.order,
    lessons: (lessons || [])
      .filter((lesson) => lesson.module_id === module.id)
      .map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.id,
        position: lesson.order,
        video_embed_html: lesson.video_embed,
        content_json: lesson.content
      }))
  }));

  const totalLessons = modulesWithLessons.reduce((total, module) => total + module.lessons.length, 0);

  cachedCourseContent = {
    course,
    modules: modulesWithLessons,
    totalLessons,
    expiresAt: now + 60_000
  };

  return cachedCourseContent;
}

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  if (!locals.session) {
    throw redirect(303, '/login');
  }

  // Cache this page for 60 seconds to reduce database load
  setHeaders({
    'cache-control': 'private, max-age=60, stale-while-revalidate=30'
  });

  const supabase = locals.supabase;
  const userId = locals.session.user.id;
  const [courseContent, progressResult] = await Promise.all([
    getCachedCourseContent(supabase),
    supabase
      .from('lesson_progress')
      .select('lesson_id, completed')
      .eq('user_id', userId)
      .eq('completed', true)
  ]);

  const completedLessonIds = progressResult.data?.map((row) => row.lesson_id) ?? [];

  return {
    course: courseContent.course,
    modules: courseContent.modules,
    completedLessonIds,
    totalLessons: courseContent.totalLessons
  };
};

export const actions: Actions = {
  toggleCompletion: async ({ request, locals }) => {
    // Require login
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    const userId = locals.session.user.id;
    const supabase = locals.supabase;

    // Read form data
    const formData = await request.formData();
    const lessonId = formData.get('lessonId') as string;
    const isCompleted = formData.get('isCompleted') === 'true';

    // Validate lessonId
    if (!lessonId) {
      return fail(400, { message: 'Lesson ID is required.' });
    }

    try {
      if (!isCompleted) {
        // Currently not completed, mark as completed
        const { error: insertError } = await supabase
          .from('lesson_progress')
          .upsert({
            user_id: userId,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error inserting progress:', insertError);
          return fail(500, { message: 'Failed to mark lesson as completed.' });
        }
      } else {
        // Currently completed, mark as not completed
        const { error: deleteError } = await supabase
          .from('lesson_progress')
          .delete()
          .eq('user_id', userId)
          .eq('lesson_id', lessonId);

        if (deleteError) {
          console.error('Error deleting progress:', deleteError);
          return fail(500, { message: 'Failed to unmark lesson.' });
        }
      }

      // Return success (client-side handles the UI update)
      return { success: true, lessonId };
    } catch (err) {
      console.error('Unexpected error in toggleCompletion:', err);
      return fail(500, { message: 'An unexpected error occurred.' });
    }
  }
};
