import { sequence } from '@sveltejs/kit/hooks';
import { supabaseHandle } from '$lib/supabase';
import type { Handle } from '@sveltejs/kit';

const PROFILE_REQUIRED_PREFIXES = [
  '/admin-dashboard',
  '/admin',
  '/manage-users',
  '/api/admin'
];
const PROFILE_FOR_NAV_PREFIXES = ['/course', '/profile'];

const SESSION_ONLY_PATHS = new Set(['/login', '/reset-password']);

function hasSupabaseAuthCookie(cookieNames: string[]) {
  return cookieNames.some((name) =>
    name.startsWith('sb-')
    || name.startsWith('__Host-sb-')
    || (name.includes('sb-') && name.includes('auth-token'))
  );
}

const authGuard: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;
  const needsProfile = PROFILE_REQUIRED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    || PROFILE_FOR_NAV_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const needsSession = needsProfile
    || SESSION_ONLY_PATHS.has(pathname)
    || pathname === '/course'
    || pathname === '/profile'
    || pathname.startsWith('/api/course');
  const needsVerifiedUser = needsProfile;

  // Public pages should not pay auth/database cost on first load.
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

export const handle = sequence(supabaseHandle, authGuard);
