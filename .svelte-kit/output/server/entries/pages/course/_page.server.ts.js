import { redirect, fail, error } from "@sveltejs/kit";
let cachedCourseContent = null;
async function fetchLessonContent(supabase, lessonId) {
  const { data, error: lessonError } = await supabase.from("lessons").select("id, video_embed, content").eq("id", lessonId).maybeSingle();
  if (lessonError || !data) {
    return null;
  }
  return {
    id: data.id,
    video_embed_html: data.video_embed,
    content_json: data.content
  };
}
async function getCachedCourseContent(supabase) {
  const now = Date.now();
  if (cachedCourseContent && cachedCourseContent.expiresAt > now) {
    return cachedCourseContent;
  }
  const { data: courses, error: courseError } = await supabase.from("courses").select("id, title, description").limit(1);
  if (courseError) {
    console.error("Error fetching course:", courseError);
    throw error(500, "Failed to load course: " + courseError.message);
  }
  if (!courses || courses.length === 0) {
    throw error(404, "No courses found");
  }
  const course = courses[0];
  const { data: modules, error: modulesError } = await supabase.from("modules").select("id, title, description, order").eq("course_id", course.id).order("order", { ascending: true });
  if (modulesError) {
    throw error(500, "Failed to load modules");
  }
  const moduleIds = (modules || []).map((m) => m.id);
  let lessons = null;
  const publishedResult = await supabase.from("lessons").select("id, module_id, title, order").in("module_id", moduleIds).eq("is_published", true).order("order", { ascending: true });
  if (publishedResult.error) {
    const fallbackResult = await supabase.from("lessons").select("id, module_id, title, order").in("module_id", moduleIds).order("order", { ascending: true });
    if (fallbackResult.error) {
      throw error(500, "Failed to load lessons");
    }
    lessons = fallbackResult.data;
  } else {
    lessons = publishedResult.data;
  }
  const modulesWithLessons = modules.map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    position: module.order,
    lessons: (lessons || []).filter((lesson) => lesson.module_id === module.id).map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      slug: lesson.id,
      position: lesson.order,
      video_embed_html: null,
      content_json: null
    }))
  }));
  const totalLessons = modulesWithLessons.reduce((total, module) => total + module.lessons.length, 0);
  cachedCourseContent = {
    course,
    modules: modulesWithLessons,
    totalLessons,
    expiresAt: now + 6e4
  };
  return cachedCourseContent;
}
const load = async ({ locals, setHeaders, url }) => {
  if (!locals.session) {
    throw redirect(303, "/login");
  }
  setHeaders({
    "cache-control": "private, max-age=60, stale-while-revalidate=30"
  });
  const supabase = locals.supabase;
  const userId = locals.session.user.id;
  const [courseContent, progressResult] = await Promise.all([
    getCachedCourseContent(supabase),
    supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", userId).eq("completed", true)
  ]);
  const completedLessonIds = progressResult.data?.map((row) => row.lesson_id) ?? [];
  const allLessons = courseContent.modules.flatMap((module) => module.lessons);
  const requestedLessonId = url.searchParams.get("lessonId");
  const selectedLessonId = requestedLessonId && allLessons.some((lesson) => lesson.id === requestedLessonId) ? requestedLessonId : allLessons[0]?.id ?? null;
  const initialLessonContent = selectedLessonId ? await fetchLessonContent(supabase, selectedLessonId) : null;
  return {
    course: courseContent.course,
    modules: courseContent.modules,
    completedLessonIds,
    totalLessons: courseContent.totalLessons,
    initialLessonId: selectedLessonId,
    initialLessonContent
  };
};
const actions = {
  toggleCompletion: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    const userId = locals.session.user.id;
    const supabase = locals.supabase;
    const formData = await request.formData();
    const lessonId = formData.get("lessonId");
    const isCompleted = formData.get("isCompleted") === "true";
    if (!lessonId) {
      return fail(400, { message: "Lesson ID is required." });
    }
    try {
      if (!isCompleted) {
        const { error: insertError } = await supabase.from("lesson_progress").upsert({
          user_id: userId,
          lesson_id: lessonId,
          completed: true,
          completed_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (insertError) {
          console.error("Error inserting progress:", insertError);
          return fail(500, { message: "Failed to mark lesson as completed." });
        }
      } else {
        const { error: deleteError } = await supabase.from("lesson_progress").delete().eq("user_id", userId).eq("lesson_id", lessonId);
        if (deleteError) {
          console.error("Error deleting progress:", deleteError);
          return fail(500, { message: "Failed to unmark lesson." });
        }
      }
      return { success: true, lessonId };
    } catch (err) {
      console.error("Unexpected error in toggleCompletion:", err);
      return fail(500, { message: "An unexpected error occurred." });
    }
  }
};
export {
  actions,
  load
};
