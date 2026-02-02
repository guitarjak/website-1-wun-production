import { redirect, error } from "@sveltejs/kit";
const load = async ({ locals, setHeaders }) => {
  if (!locals.session) {
    throw redirect(303, "/login");
  }
  if (locals.profile?.role !== "admin") {
    throw error(403, "Access denied. Admin privileges required.");
  }
  const supabase = locals.supabase;
  setHeaders({
    "cache-control": "private, max-age=300, stale-while-revalidate=60"
  });
  const { count: userCount } = await supabase.from("users_profile").select("*", { count: "exact", head: true });
  return {
    profile: locals.profile,
    userCount: userCount || 0
  };
};
export {
  load
};
