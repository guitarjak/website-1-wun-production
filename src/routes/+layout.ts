import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth');

  console.log('[LAYOUT] Environment:', isBrowser() ? 'browser' : 'server');
  console.log('[LAYOUT] Supabase URL configured:', !!PUBLIC_SUPABASE_URL);
  console.log('[LAYOUT] Supabase key configured:', !!PUBLIC_SUPABASE_ANON_KEY);

  const supabase = isBrowser()
    ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch
        }
      })
    : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch
        },
        cookies: {
          getAll() {
            return data.cookies;
          }
        }
      });

  console.log('[LAYOUT] Supabase client created');

  const {
    data: { session }
  } = await supabase.auth.getSession();

  console.log('[LAYOUT] Session status:', session ? 'active' : 'none');

  return { ...data, supabase, session };
};
