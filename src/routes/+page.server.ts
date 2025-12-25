import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // If already logged in, redirect to course page (or admin dashboard for admins)
  if (locals.session && locals.profile) {
    if (locals.profile.role === 'admin') {
      throw redirect(303, '/admin-dashboard');
    } else {
      throw redirect(303, '/course');
    }
  }

  // Not logged in - show landing page
  return {};
};
