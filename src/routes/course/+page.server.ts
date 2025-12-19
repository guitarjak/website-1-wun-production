import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Module } from '../../../app.d';

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

  // Note: enrollments table doesn't exist in schema, so all authenticated users can access

  // Load modules for this course
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, title, description, order')
    .eq('course_id', course.id)
    .order('order', { ascending: true });

  if (modulesError) {
    throw error(500, 'Failed to load modules');
  }

  // Load all published lessons for these modules
  const moduleIds = (modules || []).map((m) => m.id);

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, module_id, title, order, video_embed, content')
    .in('module_id', moduleIds)
    .order('order', { ascending: true });

  if (lessonsError) {
    throw error(500, 'Failed to load lessons');
  }

  // Combine modules with their lessons
  const modulesWithLessons: Module[] = (modules || []).map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    position: module.order,
    lessons: (lessons || [])
      .filter((lesson) => lesson.module_id === module.id)
      .map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.id, // Use id as slug since slug doesn't exist
        position: lesson.order,
        video_embed_html: lesson.video_embed,
        content_json: lesson.content
      }))
  }));

  // Load lesson progress for the current user
  const { data: progressRows, error: progressError } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', userId)
    .eq('completed', true);

  // Build array of completed lesson IDs
  const completedLessonIds = progressRows?.map((row) => row.lesson_id) ?? [];

  // Calculate total number of lessons
  const totalLessons = modulesWithLessons.reduce((total, module) => total + module.lessons.length, 0);

  return {
    course,
    modules: modulesWithLessons,
    completedLessonIds,
    totalLessons
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
