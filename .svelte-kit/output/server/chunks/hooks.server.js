import { sequence } from "@sveltejs/kit/hooks";
import { createServerClient } from "@supabase/ssr";
import { P as PUBLIC_SUPABASE_URL, a as PUBLIC_SUPABASE_ANON_KEY } from "./public.js";
const supabaseHandle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: "/" });
        });
      }
    }
  });
  event.locals.safeGetSession = async (withProfile = true, verifyUser = true) => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    if (!session) {
      return { session: null, profile: null };
    }
    if (!verifyUser) {
      return { session, profile: null };
    }
    if (!withProfile) {
      return { session, profile: null };
    }
    const {
      data: { user },
      error
    } = await event.locals.supabase.auth.getUser();
    if (error || !user) {
      return { session: null, profile: null };
    }
    const { data: profile, error: profileError } = await event.locals.supabase.from("users_profile").select("id, email, full_name, role").eq("id", user.id).single();
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return { session, profile: null };
    }
    return { session, profile };
  };
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    }
  });
};
const PROFILE_REQUIRED_PREFIXES = [
  "/admin-dashboard",
  "/admin",
  "/manage-users",
  "/api/admin"
];
const SESSION_ONLY_PATHS = /* @__PURE__ */ new Set(["/login", "/reset-password"]);
function hasSupabaseAuthCookie(cookieNames) {
  return cookieNames.some((name) => name.startsWith("sb-"));
}
const authGuard = async ({ event, resolve }) => {
  const pathname = event.url.pathname;
  const needsProfile = PROFILE_REQUIRED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const needsSession = needsProfile || SESSION_ONLY_PATHS.has(pathname) || pathname === "/course" || pathname === "/profile";
  const needsVerifiedUser = needsProfile;
  if (!needsSession) {
    event.locals.session = null;
    event.locals.profile = null;
    return resolve(event);
  }
  const cookieNames = event.cookies.getAll().map(({ name }) => name);
  if (!hasSupabaseAuthCookie(cookieNames)) {
    event.locals.session = null;
    event.locals.profile = null;
    return resolve(event);
  }
  const { session, profile } = await event.locals.safeGetSession(needsProfile, needsVerifiedUser);
  event.locals.session = session;
  event.locals.profile = profile;
  return resolve(event);
};
const handle = sequence(supabaseHandle, authGuard);
export {
  handle
};
