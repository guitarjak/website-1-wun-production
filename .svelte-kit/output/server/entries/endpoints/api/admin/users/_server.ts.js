import { json } from "@sveltejs/kit";
import { createClient } from "@supabase/supabase-js";
import { P as PUBLIC_SUPABASE_URL } from "../../../../../chunks/public.js";
const SUPABASE_SERVICE_ROLE_KEY = "sb_secret_sTR4-2H_5rKh2FXqoad63Q_qOacJuqq";
const ADMIN_BEARER_TOKEN = "b5348d633708fc3d713eba55f8d10a7c8d4a600c67c49046bb9655c04eaf64c4";
const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
const POST = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    if (token !== ADMIN_BEARER_TOKEN) {
      return json({ error: "Invalid authorization token" }, { status: 403 });
    }
    const body = await request.json();
    const { email, password, full_name, role = "student" } = body;
    if (!email || !password) {
      return json({ error: "Email and password are required" }, { status: 400 });
    }
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      // Auto-confirm email
      user_metadata: {
        full_name: full_name || email,
        role
        // Include role in metadata so trigger can use it
      }
    });
    if (authError) {
      console.error("Error creating auth user:", authError);
      return json({ error: authError.message }, { status: 400 });
    }
    if (!authData.user) {
      return json({ error: "Failed to create user" }, { status: 500 });
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    const { data: profile, error: profileError } = await supabaseAdmin.from("users_profile").select("id, email, full_name, role").eq("id", authData.user.id).single();
    if (profileError || !profile) {
      console.error("Error fetching user profile:", profileError);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return json({ error: "Failed to create user profile" }, { status: 500 });
    }
    return json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
const GET = async ({ request, url }) => {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    if (token !== ADMIN_BEARER_TOKEN) {
      return json({ error: "Invalid authorization token" }, { status: 403 });
    }
    const email = url.searchParams.get("email");
    if (!email) {
      return json({ error: "Email parameter is required" }, { status: 400 });
    }
    const { data: profile, error: profileError } = await supabaseAdmin.from("users_profile").select("id, email, full_name, role, is_active, created_at").eq("email", email).maybeSingle();
    if (profileError) {
      console.error("Error checking user profile:", profileError);
      return json({ error: "Failed to check user profile" }, { status: 500 });
    }
    if (profile) {
      return json({
        exists: true,
        user: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          is_active: profile.is_active,
          created_at: profile.created_at
        }
      }, { status: 200 });
    } else {
      return json({
        exists: false,
        user: null
      }, { status: 200 });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
export {
  GET,
  POST
};
