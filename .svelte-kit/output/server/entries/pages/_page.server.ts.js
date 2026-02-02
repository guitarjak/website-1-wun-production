import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (locals.session && locals.profile) {
    if (locals.profile.role === "admin") {
      throw redirect(303, "/admin-dashboard");
    } else {
      throw redirect(303, "/course");
    }
  }
  return {};
};
export {
  load
};
