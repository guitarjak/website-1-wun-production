import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

export const supabaseHandle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            event.cookies.set(name, value, { ...options, path: '/' });
          } catch (error) {
            // Supabase can attempt async cookie updates after the response is sent.
            // Ignore that specific case so requests don't crash.
            if (
              !(error instanceof Error)
              || !error.message.includes('Cannot use `cookies.set(...)` after the response has been generated')
            ) {
              throw error;
            }
          }
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

    // For routes that only need to know if a session exists, avoid extra DB work.
    if (!withProfile && !verifyUser) {
      return { session, profile: null };
    }

    let profileUserId: string | null = null;

    if (verifyUser) {
      const {
        data: { user },
        error
      } = await event.locals.supabase.auth.getUser();

      if (error || !user) {
        return { session: null, profile: null };
      }

      if (!withProfile) {
        return { session, profile: null };
      }

      profileUserId = user.id;
    } else if (withProfile) {
      profileUserId = session.user.id;
    } else {
      return { session, profile: null };
    }

    // Fetch profile from database
    const { data: profile, error: profileError } = await event.locals.supabase
      .from('users_profile')
      .select('id, email, full_name, role')
      .eq('id', profileUserId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { session, profile: null };
    }

    return { session, profile };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};
