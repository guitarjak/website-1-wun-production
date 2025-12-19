import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // If already logged in, redirect based on role
  if (locals.session && locals.profile) {
    if (locals.profile.role === 'admin') {
      throw redirect(303, '/admin-dashboard');
    } else {
      throw redirect(303, '/course');
    }
  }

  return {};
};

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    // Get the profile to determine redirect
    const {
      data: { user }
    } = await locals.supabase.auth.getUser();

    if (user) {
      const { data: profile } = await locals.supabase
        .from('users_profile')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        throw redirect(303, '/admin-dashboard');
      }
    }

    throw redirect(303, '/course');
  }
};
