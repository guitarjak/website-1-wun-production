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
const actions = {
  login: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    const {
      data: { user }
    } = await locals.supabase.auth.getUser();
    if (user) {
      const { data: profile } = await locals.supabase.from("users_profile").select("role").eq("id", user.id).single();
      if (profile?.role === "admin") {
        throw redirect(303, "/admin-dashboard");
      }
    }
    throw redirect(303, "/course");
  },
  forgotPassword: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    if (!email) {
      return {
        type: "forgotPassword",
        success: false,
        error: "Email is required"
      };
    }
    const { error } = await locals.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${url.origin}/reset-password`
    });
    if (error) {
      return {
        type: "forgotPassword",
        success: false,
        error: error.message
      };
    }
    return {
      type: "forgotPassword",
      success: true,
      message: "Password reset email sent. Please check your inbox."
    };
  }
};
export {
  actions,
  load
};
