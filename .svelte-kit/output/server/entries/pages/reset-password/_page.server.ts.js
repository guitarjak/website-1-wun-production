import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  return {};
};
const actions = {
  resetPassword: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    if (!password || !confirmPassword) {
      return {
        success: false,
        error: "Both password fields are required"
      };
    }
    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match"
      };
    }
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long"
      };
    }
    const { error } = await locals.supabase.auth.updateUser({
      password
    });
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    await locals.supabase.auth.signOut();
    throw redirect(303, "/login?reset=success");
  }
};
export {
  actions,
  load
};
