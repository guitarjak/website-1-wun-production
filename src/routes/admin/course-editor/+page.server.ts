import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

type AdminLesson = {
  id: string;
  title: string;
  slug: string;
  position: number;
  video_embed_html: string | null;
  content_json: any | null;
  is_published: boolean;
};

type AdminModule = {
  id: string;
  title: string;
  position: number;
  lessons: AdminLesson[];
};

export const load: PageServerLoad = async ({ locals, url, setHeaders }) => {
  // Require authentication
  if (!locals.session) {
    throw redirect(303, '/login');
  }

  // Require admin role
  if (locals.profile?.role !== 'admin') {
    throw redirect(303, '/course');
  }

  // Cache this page for 60 seconds to reduce database load during editing sessions
  setHeaders({
    'cache-control': 'private, max-age=60, stale-while-revalidate=30'
  });

  const supabase = locals.supabase;

  // Load the first course
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

  // Load modules for this course
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, title, description, order')
    .eq('course_id', course.id)
    .order('order', { ascending: true });

  if (modulesError) {
    throw error(500, 'Failed to load modules');
  }

  // Load all lessons for these modules (including unpublished)
  const moduleIds = (modules || []).map((m) => m.id);

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, module_id, title, order, video_embed, content')
    .in('module_id', moduleIds)
    .order('order', { ascending: true });

  if (lessonsError) {
    throw error(500, 'Failed to load lessons');
  }

  // Helper function to parse content (handles both HTML strings and JSON strings)
  function parseContent(content: string | null) {
    if (!content) return null;

    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(content);
      // If it's a valid TipTap document, return it
      if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
        return parsed;
      }
    } catch (e) {
      // Not valid JSON, treat as HTML string
    }

    // Return as HTML string (TipTap can parse it)
    return content;
  }

  // Combine modules with their lessons
  const modulesWithLessons: AdminModule[] = (modules || []).map((module) => ({
    id: module.id,
    title: module.title,
    position: module.order,
    lessons: (lessons || [])
      .filter((lesson) => lesson.module_id === module.id)
      .map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.id, // Use id as slug
        position: lesson.order,
        video_embed_html: lesson.video_embed,
        content_json: parseContent(lesson.content),
        is_published: true // Assume all lessons are published
      }))
  }));

  // Determine selected lesson
  const lessonIdParam = url.searchParams.get('lessonId');
  let selectedLessonId: string | null = null;

  if (lessonIdParam) {
    // Check if this lesson exists
    const lessonExists = (lessons || []).some((l) => l.id === lessonIdParam);
    if (lessonExists) {
      selectedLessonId = lessonIdParam;
    }
  }

  // If no valid selection, pick the first lesson
  if (!selectedLessonId && lessons && lessons.length > 0) {
    selectedLessonId = lessons[0].id;
  }

  return {
    course,
    modules: modulesWithLessons,
    selectedLessonId
  };
};

export const actions: Actions = {
  save: async ({ request, locals }) => {
    // Require authentication and admin role
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    if (locals.profile?.role !== 'admin') {
      throw redirect(303, '/course');
    }

    const formData = await request.formData();
    const lessonId = formData.get('lessonId') as string;
    const title = formData.get('title') as string;
    const video_embed_html = formData.get('video_embed_html') as string;
    const content_json_str = formData.get('content_json') as string;

    // Validate required fields
    if (!lessonId || !title) {
      return fail(400, {
        error: 'Lesson ID and title are required'
      });
    }

    // Parse content_json safely and keep as string for database storage
    let content_to_save = null;
    if (content_json_str) {
      try {
        // Validate it's valid JSON
        JSON.parse(content_json_str);
        // Store as JSON string in database
        content_to_save = content_json_str;
      } catch (e) {
        return fail(400, {
          error: 'Invalid content JSON'
        });
      }
    }

    // Update the lesson
    const { error: updateError } = await locals.supabase
      .from('lessons')
      .update({
        title,
        video_embed: video_embed_html || null,
        content: content_to_save
      })
      .eq('id', lessonId);

    if (updateError) {
      return fail(500, {
        error: 'Failed to save lesson: ' + updateError.message
      });
    }

    // Return success without redirect (for in-place save)
    return {
      success: true
    };
  },

  updateCourse: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    if (locals.profile?.role !== 'admin') {
      throw redirect(303, '/course');
    }

    const formData = await request.formData();
    const courseId = formData.get('courseId') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const description = formData.get('description') as string;

    if (!courseId || !title) {
      return fail(400, {
        error: 'Course ID and title are required'
      });
    }

    const { error: updateError } = await locals.supabase
      .from('courses')
      .update({
        title,
        description: description || null
      })
      .eq('id', courseId);

    if (updateError) {
      return fail(500, {
        error: 'Failed to update course: ' + updateError.message
      });
    }

    return {
      success: true
    };
  },

  createModule: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    if (locals.profile?.role !== 'admin') {
      throw redirect(303, '/course');
    }

    const formData = await request.formData();
    const courseId = formData.get('courseId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!courseId || !title) {
      return fail(400, {
        error: 'Course ID and title are required'
      });
    }

    // Get max order for ordering
    const { data: existingModules } = await locals.supabase
      .from('modules')
      .select('order')
      .eq('course_id', courseId)
      .order('order', { ascending: false })
      .limit(1);

    const newOrder = existingModules && existingModules.length > 0
      ? existingModules[0].order + 1
      : 0;

    // Insert new module
    const { data: newModule, error: insertError } = await locals.supabase
      .from('modules')
      .insert({
        course_id: courseId,
        title,
        description: description || null,
        order: newOrder
      })
      .select('id, title, description, order')
      .single();

    if (insertError || !newModule) {
      return fail(500, {
        error: 'Failed to create module: ' + (insertError?.message || 'Unknown error')
      });
    }

    return {
      success: true,
      module: newModule
    };
  },

  updateModule: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    if (locals.profile?.role !== 'admin') {
      throw redirect(303, '/course');
    }

    const formData = await request.formData();
    const moduleId = formData.get('moduleId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!moduleId || !title) {
      return fail(400, {
        error: 'Module ID and title are required'
      });
    }

    const { error: updateError } = await locals.supabase
      .from('modules')
      .update({
        title,
        description: description || null
      })
      .eq('id', moduleId);

    if (updateError) {
      return fail(500, {
        error: 'Failed to update module: ' + updateError.message
      });
    }

    return {
      success: true
    };
  },

  deleteModule: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    if (locals.profile?.role !== 'admin') {
      throw redirect(303, '/course');
    }

    const formData = await request.formData();
    const moduleId = formData.get('moduleId') as string;

    if (!moduleId) {
      return fail(400, {
        error: 'Module ID is required'
      });
    }

    // Delete all lessons in this module first (cascade delete)
    const { error: deleteLessonsError } = await locals.supabase
      .from('lessons')
      .delete()
      .eq('module_id', moduleId);

    if (deleteLessonsError) {
      return fail(500, {
        error: 'Failed to delete lessons: ' + deleteLessonsError.message
      });
    }

    // Delete the module
    const { error: deleteModuleError } = await locals.supabase
      .from('modules')
      .delete()
      .eq('id', moduleId);

    if (deleteModuleError) {
      return fail(500, {
        error: 'Failed to delete module: ' + deleteModuleError.message
      });
    }

    return {
      success: true
    };
  },

  reorderModules: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    if (locals.profile?.role !== 'admin') {
      throw redirect(303, '/course');
    }

    const formData = await request.formData();
    const updatesJson = formData.get('updates') as string;

    if (!updatesJson) {
      return fail(400, {
        error: 'Updates are required'
      });
    }

    let updates: { id: string; position: number }[];
    try {
      updates = JSON.parse(updatesJson);
    } catch (e) {
      return fail(400, {
        error: 'Invalid updates format'
      });
    }

    // Update each module's order
    for (const update of updates) {
      const { error: updateError } = await locals.supabase
        .from('modules')
        .update({ order: update.position })
        .eq('id', update.id);

      if (updateError) {
        return fail(500, {
          error: 'Failed to reorder modules: ' + updateError.message
        });
      }
    }

    return {
      success: true
    };
  },

  createLesson: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    if (locals.profile?.role !== 'admin') {
      throw redirect(303, '/course');
    }

    const formData = await request.formData();
    const moduleId = formData.get('moduleId') as string;
    const title = formData.get('title') as string;

    if (!moduleId || !title) {
      return fail(400, {
        error: 'Module ID and title are required'
      });
    }

    // Get max order for ordering
    const { data: existingLessons } = await locals.supabase
      .from('lessons')
      .select('order')
      .eq('module_id', moduleId)
      .order('order', { ascending: false })
      .limit(1);

    const newOrder = existingLessons && existingLessons.length > 0
      ? existingLessons[0].order + 1
      : 0;

    // Insert new lesson
    const { data: newLesson, error: insertError } = await locals.supabase
      .from('lessons')
      .insert({
        module_id: moduleId,
        title,
        order: newOrder,
        video_embed: null,
        content: null
      })
      .select('id, module_id, title, order, video_embed, content')
      .single();

    if (insertError || !newLesson) {
      return fail(500, {
        error: 'Failed to create lesson: ' + (insertError?.message || 'Unknown error')
      });
    }

    return {
      success: true,
      lesson: {
        ...newLesson,
        slug: newLesson.id, // Add slug for compatibility
        position: newLesson.order, // Add position for compatibility
        video_embed_html: newLesson.video_embed,
        content_json: newLesson.content,
        is_published: true
      }
    };
  },

  deleteLesson: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    if (locals.profile?.role !== 'admin') {
      throw redirect(303, '/course');
    }

    const formData = await request.formData();
    const lessonId = formData.get('lessonId') as string;

    if (!lessonId) {
      return fail(400, {
        error: 'Lesson ID is required'
      });
    }

    const { error: deleteError } = await locals.supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (deleteError) {
      return fail(500, {
        error: 'Failed to delete lesson: ' + deleteError.message
      });
    }

    return {
      success: true
    };
  },

  togglePublish: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    if (locals.profile?.role !== 'admin') {
      throw redirect(303, '/course');
    }

    const formData = await request.formData();
    const lessonId = formData.get('lessonId') as string;
    const isPublished = formData.get('isPublished') === 'true';

    if (!lessonId) {
      return fail(400, {
        error: 'Lesson ID is required'
      });
    }

    // Note: is_published column doesn't exist in database
    // All lessons are considered published
    return {
      success: true,
      newStatus: true // Always published
    };
  },

  reorderLessons: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, '/login');
    }

    if (locals.profile?.role !== 'admin') {
      throw redirect(303, '/course');
    }

    const formData = await request.formData();
    const updatesJson = formData.get('updates') as string;

    if (!updatesJson) {
      return fail(400, {
        error: 'Updates are required'
      });
    }

    let updates: { id: string; position: number }[];
    try {
      updates = JSON.parse(updatesJson);
    } catch (e) {
      return fail(400, {
        error: 'Invalid updates format'
      });
    }

    // Update each lesson's order
    for (const update of updates) {
      const { error: updateError } = await locals.supabase
        .from('lessons')
        .update({ order: update.position })
        .eq('id', update.id);

      if (updateError) {
        return fail(500, {
          error: 'Failed to reorder lessons: ' + updateError.message
        });
      }
    }

    return {
      success: true
    };
  }
};
