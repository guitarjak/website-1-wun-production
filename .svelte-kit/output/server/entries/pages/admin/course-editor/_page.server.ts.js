import { redirect, error, fail } from "@sveltejs/kit";
const load = async ({ locals, url, setHeaders }) => {
  if (!locals.session) {
    throw redirect(303, "/login");
  }
  if (locals.profile?.role !== "admin") {
    throw redirect(303, "/course");
  }
  setHeaders({
    "cache-control": "private, max-age=60, stale-while-revalidate=30"
  });
  const supabase = locals.supabase;
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
  let lessonsError = null;
  const fullResult = await supabase.from("lessons").select("id, module_id, title, order, video_embed, content, is_published").in("module_id", moduleIds).order("order", { ascending: true });
  if (fullResult.error) {
    const fallbackResult = await supabase.from("lessons").select("id, module_id, title, order, video_embed, content").in("module_id", moduleIds).order("order", { ascending: true });
    lessons = fallbackResult.data;
    lessonsError = fallbackResult.error;
  } else {
    lessons = fullResult.data;
  }
  if (lessonsError) {
    throw error(500, "Failed to load lessons");
  }
  function parseContent(content) {
    if (!content) return null;
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object" && parsed.type === "doc") {
        return parsed;
      }
    } catch (e) {
    }
    return content;
  }
  const modulesWithLessons = (modules || []).map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description || null,
    position: module.order,
    lessons: (lessons || []).filter((lesson) => lesson.module_id === module.id).map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      slug: lesson.id,
      // Use id as slug
      position: lesson.order,
      video_embed_html: lesson.video_embed,
      content_json: parseContent(lesson.content),
      is_published: lesson.is_published ?? true
    }))
  }));
  const lessonIdParam = url.searchParams.get("lessonId");
  let selectedLessonId = null;
  if (lessonIdParam) {
    const lessonExists = (lessons || []).some((l) => l.id === lessonIdParam);
    if (lessonExists) {
      selectedLessonId = lessonIdParam;
    }
  }
  if (!selectedLessonId && lessons && lessons.length > 0) {
    selectedLessonId = lessons[0].id;
  }
  return {
    course,
    modules: modulesWithLessons,
    selectedLessonId
  };
};
const actions = {
  save: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const lessonId = formData.get("lessonId");
    const title = formData.get("title");
    const video_embed_html = formData.get("video_embed_html");
    const content_json_str = formData.get("content_json");
    if (!lessonId || !title) {
      return fail(400, {
        error: "Lesson ID and title are required"
      });
    }
    let content_to_save = null;
    if (content_json_str) {
      try {
        JSON.parse(content_json_str);
        content_to_save = content_json_str;
      } catch (e) {
        return fail(400, {
          error: "Invalid content JSON"
        });
      }
    }
    const { error: updateError } = await locals.supabase.from("lessons").update({
      title,
      video_embed: video_embed_html || null,
      content: content_to_save
    }).eq("id", lessonId);
    if (updateError) {
      return fail(500, {
        error: "Failed to save lesson: " + updateError.message
      });
    }
    return {
      success: true
    };
  },
  updateCourse: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const courseId = formData.get("courseId");
    const title = formData.get("title");
    formData.get("subtitle");
    const description = formData.get("description");
    if (!courseId || !title) {
      return fail(400, {
        error: "Course ID and title are required"
      });
    }
    const { error: updateError } = await locals.supabase.from("courses").update({
      title,
      description: description || null
    }).eq("id", courseId);
    if (updateError) {
      return fail(500, {
        error: "Failed to update course: " + updateError.message
      });
    }
    return {
      success: true
    };
  },
  createModule: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const courseId = formData.get("courseId");
    const title = formData.get("title");
    const description = formData.get("description");
    if (!courseId || !title) {
      return fail(400, {
        error: "Course ID and title are required"
      });
    }
    const { data: existingModules } = await locals.supabase.from("modules").select("order").eq("course_id", courseId).order("order", { ascending: false }).limit(1);
    const newOrder = existingModules && existingModules.length > 0 ? existingModules[0].order + 1 : 0;
    const { data: newModule, error: insertError } = await locals.supabase.from("modules").insert({
      course_id: courseId,
      title,
      description: description || null,
      order: newOrder
    }).select("id, title, description, order").single();
    if (insertError || !newModule) {
      return fail(500, {
        error: "Failed to create module: " + (insertError?.message || "Unknown error")
      });
    }
    return {
      success: true,
      module: newModule
    };
  },
  updateModule: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const moduleId = formData.get("moduleId");
    const title = formData.get("title");
    const description = formData.get("description");
    if (!moduleId || !title) {
      return fail(400, {
        error: "Module ID and title are required"
      });
    }
    const { error: updateError } = await locals.supabase.from("modules").update({
      title,
      description: description || null
    }).eq("id", moduleId);
    if (updateError) {
      return fail(500, {
        error: "Failed to update module: " + updateError.message
      });
    }
    return {
      success: true
    };
  },
  deleteModule: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const moduleId = formData.get("moduleId");
    if (!moduleId) {
      return fail(400, {
        error: "Module ID is required"
      });
    }
    const { error: deleteLessonsError } = await locals.supabase.from("lessons").delete().eq("module_id", moduleId);
    if (deleteLessonsError) {
      return fail(500, {
        error: "Failed to delete lessons: " + deleteLessonsError.message
      });
    }
    const { error: deleteModuleError } = await locals.supabase.from("modules").delete().eq("id", moduleId);
    if (deleteModuleError) {
      return fail(500, {
        error: "Failed to delete module: " + deleteModuleError.message
      });
    }
    return {
      success: true
    };
  },
  reorderModules: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const updatesJson = formData.get("updates");
    if (!updatesJson) {
      return fail(400, {
        error: "Updates are required"
      });
    }
    let updates;
    try {
      updates = JSON.parse(updatesJson);
    } catch (e) {
      return fail(400, {
        error: "Invalid updates format"
      });
    }
    for (const update of updates) {
      const { error: updateError } = await locals.supabase.from("modules").update({ order: update.position }).eq("id", update.id);
      if (updateError) {
        return fail(500, {
          error: "Failed to reorder modules: " + updateError.message
        });
      }
    }
    return {
      success: true
    };
  },
  createLesson: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const moduleId = formData.get("moduleId");
    const title = formData.get("title");
    if (!moduleId || !title) {
      return fail(400, {
        error: "Module ID and title are required"
      });
    }
    const { data: existingLessons } = await locals.supabase.from("lessons").select("order").eq("module_id", moduleId).order("order", { ascending: false }).limit(1);
    const newOrder = existingLessons && existingLessons.length > 0 ? existingLessons[0].order + 1 : 0;
    let insertResult = await locals.supabase.from("lessons").insert({
      module_id: moduleId,
      title,
      order: newOrder,
      video_embed: null,
      content: null,
      is_published: false
    }).select("id, module_id, title, order, video_embed, content, is_published").single();
    if (insertResult.error && insertResult.error.message?.includes("is_published")) {
      insertResult = await locals.supabase.from("lessons").insert({
        module_id: moduleId,
        title,
        order: newOrder,
        video_embed: null,
        content: null
      }).select("id, module_id, title, order, video_embed, content").single();
    }
    const { data: newLesson, error: insertError } = insertResult;
    if (insertError || !newLesson) {
      return fail(500, {
        error: "Failed to create lesson: " + (insertError?.message || "Unknown error")
      });
    }
    return {
      success: true,
      lesson: {
        ...newLesson,
        slug: newLesson.id,
        // Add slug for compatibility
        position: newLesson.order,
        // Add position for compatibility
        video_embed_html: newLesson.video_embed,
        content_json: newLesson.content,
        is_published: newLesson.is_published ?? true
      }
    };
  },
  deleteLesson: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const lessonId = formData.get("lessonId");
    if (!lessonId) {
      return fail(400, {
        error: "Lesson ID is required"
      });
    }
    const { error: deleteError } = await locals.supabase.from("lessons").delete().eq("id", lessonId);
    if (deleteError) {
      return fail(500, {
        error: "Failed to delete lesson: " + deleteError.message
      });
    }
    return {
      success: true
    };
  },
  togglePublish: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const lessonId = formData.get("lessonId");
    const isPublished = formData.get("isPublished") === "true";
    if (!lessonId) {
      return fail(400, {
        error: "Lesson ID is required"
      });
    }
    const newStatus = !isPublished;
    const { error: updateError } = await locals.supabase.from("lessons").update({ is_published: newStatus }).eq("id", lessonId);
    if (updateError) {
      if (updateError.message?.includes("is_published")) {
        return fail(400, {
          error: "Publish toggle requires lessons.is_published. Run supabase-add-is-published.sql in Supabase SQL Editor."
        });
      }
      return fail(500, {
        error: "Failed to toggle publish status: " + updateError.message
      });
    }
    return {
      success: true,
      newStatus
    };
  },
  duplicateLesson: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const lessonId = formData.get("lessonId");
    if (!lessonId) {
      return fail(400, { error: "Lesson ID is required" });
    }
    const { data: sourceLesson, error: fetchError } = await locals.supabase.from("lessons").select("title, module_id, video_embed, content, is_published").eq("id", lessonId).single();
    if (fetchError || !sourceLesson) {
      return fail(500, { error: "Failed to fetch lesson: " + (fetchError?.message || "Not found") });
    }
    const { data: existingLessons } = await locals.supabase.from("lessons").select("order").eq("module_id", sourceLesson.module_id).order("order", { ascending: false }).limit(1);
    const newOrder = existingLessons && existingLessons.length > 0 ? existingLessons[0].order + 1 : 0;
    const { data: newLesson, error: insertError } = await locals.supabase.from("lessons").insert({
      module_id: sourceLesson.module_id,
      title: sourceLesson.title + " (Copy)",
      order: newOrder,
      video_embed: sourceLesson.video_embed,
      content: sourceLesson.content,
      is_published: sourceLesson.is_published ?? true
    }).select("id, module_id, title, order, video_embed, content, is_published").single();
    if (insertError || !newLesson) {
      return fail(500, { error: "Failed to duplicate lesson: " + (insertError?.message || "Unknown error") });
    }
    return {
      success: true,
      lesson: {
        id: newLesson.id,
        title: newLesson.title,
        slug: newLesson.id,
        position: newLesson.order,
        video_embed_html: newLesson.video_embed,
        content_json: newLesson.content,
        is_published: newLesson.is_published ?? true
      },
      moduleId: newLesson.module_id
    };
  },
  reorderLessons: async ({ request, locals }) => {
    if (!locals.session) {
      throw redirect(303, "/login");
    }
    if (locals.profile?.role !== "admin") {
      throw redirect(303, "/course");
    }
    const formData = await request.formData();
    const updatesJson = formData.get("updates");
    if (!updatesJson) {
      return fail(400, {
        error: "Updates are required"
      });
    }
    let updates;
    try {
      updates = JSON.parse(updatesJson);
    } catch (e) {
      return fail(400, {
        error: "Invalid updates format"
      });
    }
    for (const update of updates) {
      const { error: updateError } = await locals.supabase.from("lessons").update({ order: update.position }).eq("id", update.id);
      if (updateError) {
        return fail(500, {
          error: "Failed to reorder lessons: " + updateError.message
        });
      }
    }
    return {
      success: true
    };
  }
};
export {
  actions,
  load
};
