import { redirect, error } from "@sveltejs/kit";
const load = async ({ locals, setHeaders }) => {
  if (!locals.session || !locals.profile || locals.profile.role !== "admin") {
    throw redirect(303, "/login");
  }
  const supabase = locals.supabase;
  setHeaders({
    "cache-control": "private, max-age=300, stale-while-revalidate=60"
  });
  const { data: courses, error: courseError } = await supabase.from("courses").select("id").limit(1);
  if (courseError) {
    console.error("Error fetching course:", courseError);
    throw error(500, "Failed to load course: " + courseError.message);
  }
  if (!courses || courses.length === 0) {
    throw error(404, "No courses found");
  }
  const course = courses[0];
  const { data: modules } = await supabase.from("modules").select("id").eq("course_id", course.id);
  const moduleIds = (modules || []).map((m) => m.id);
  const [usersResult, lessonsCountResult, progressResult] = await Promise.all([
    // Get all users from users_profile
    supabase.from("users_profile").select("id, email, full_name, role, created_at").order("created_at", { ascending: false }),
    // Get all lessons count for this course
    supabase.from("lessons").select("*", { count: "exact", head: true }).in("module_id", moduleIds),
    // Get lesson progress for all users
    supabase.from("lesson_progress").select("user_id, lesson_id, completed, completed_at").eq("completed", true)
  ]);
  if (usersResult.error) {
    console.error("Error fetching users:", usersResult.error);
    throw error(500, "Failed to load users");
  }
  const users = usersResult.data;
  const totalLessons = lessonsCountResult.count || 0;
  const allProgress = progressResult.data;
  const progressMap = /* @__PURE__ */ new Map();
  (allProgress || []).forEach((progress) => {
    if (!progressMap.has(progress.user_id)) {
      progressMap.set(progress.user_id, { completedLessons: 0, lastActivity: null });
    }
    const userProgress = progressMap.get(progress.user_id);
    userProgress.completedLessons += 1;
    if (!userProgress.lastActivity || progress.completed_at > userProgress.lastActivity) {
      userProgress.lastActivity = progress.completed_at;
    }
  });
  const usersWithProgress = (users || []).map((user) => {
    const progress = progressMap.get(user.id) || { completedLessons: 0, lastActivity: null };
    const progressPercentage = totalLessons && totalLessons > 0 ? Math.round(progress.completedLessons / totalLessons * 100) : 0;
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      createdAt: user.created_at,
      enrolledAt: user.created_at,
      // Use account creation as enrollment date
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
export {
  load
};
