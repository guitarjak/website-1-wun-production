import { redirect } from "@sveltejs/kit";
const load = async ({ locals, setHeaders }) => {
  if (!locals.session) {
    throw redirect(303, "/login");
  }
  const supabase = locals.supabase;
  const userId = locals.session.user.id;
  setHeaders({
    "cache-control": "private, max-age=120, stale-while-revalidate=30"
  });
  const { data: courses, error: courseError } = await supabase.from("courses").select("id").limit(1);
  if (courseError || !courses || courses.length === 0) {
    return {
      profile: locals.profile,
      stats: null
    };
  }
  const course = courses[0];
  const { data: modules } = await supabase.from("modules").select("id").eq("course_id", course.id);
  const moduleIds = (modules || []).map((m) => m.id);
  const [lessonsCountResult, progressResult] = await Promise.all([
    // Get total lessons count
    supabase.from("lessons").select("*", { count: "exact", head: true }).in("module_id", moduleIds),
    // Get user's completed lessons
    supabase.from("lesson_progress").select("lesson_id, completed_at, completed").eq("user_id", userId).eq("completed", true).order("completed_at", { ascending: false })
  ]);
  const totalLessons = lessonsCountResult.count || 0;
  const completedLessons = progressResult.data?.length || 0;
  const progressPercentage = totalLessons > 0 ? Math.round(completedLessons / totalLessons * 100) : 0;
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
export {
  load
};
