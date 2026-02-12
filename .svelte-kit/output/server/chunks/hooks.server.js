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
  event.locals.safeGetSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    if (!session) {
      return { session: null, profile: null };
    }
    const {
      data: { user },
      error
    } = await event.locals.supabase.auth.getUser();
    if (error) {
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
const authGuard = async ({ event, resolve }) => {
  const { session, profile } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.profile = profile;
  return resolve(event);
};
const handle = sequence(supabaseHandle, authGuard);
export {
  handle
};
