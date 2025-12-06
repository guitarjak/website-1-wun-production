import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';

/**
 * Creates a Supabase server client, cached per request.
 * Using React's cache() ensures we only create one client per request,
 * avoiding multiple token refresh calls.
 */
export const createSupabaseServerClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
});
