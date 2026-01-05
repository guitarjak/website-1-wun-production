import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  // Get the token from URL params
  const token = url.searchParams.get('token');
  const type = url.searchParams.get('type');

  // Redirect to login if no token or not password recovery
  if (!token || type !== 'recovery') {
    throw redirect(303, '/login');
  }

  return {
    token
  };
};

export const actions: Actions = {
  resetPassword: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validate passwords
    if (!password || !confirmPassword) {
      return {
        success: false,
        error: 'Both password fields are required'
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match'
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long'
      };
    }

    // Update the password
    const { error } = await locals.supabase.auth.updateUser({
      password: password
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    // Sign out to force fresh login with new password
    await locals.supabase.auth.signOut();

    // Redirect to login with success message
    throw redirect(303, '/login?reset=success');
  }
};
