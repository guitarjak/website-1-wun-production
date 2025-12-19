import { sequence } from '@sveltejs/kit/hooks';
import { supabaseHandle } from '$lib/supabase';
import type { Handle } from '@sveltejs/kit';

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, profile } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.profile = profile;

  return resolve(event);
};

export const handle = sequence(supabaseHandle, authGuard);
