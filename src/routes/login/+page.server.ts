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
    console.log('[SERVER LOGIN] Action started');
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('[SERVER LOGIN] Email:', email);
    console.log('[SERVER LOGIN] Supabase client available:', !!locals.supabase);

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('[SERVER LOGIN] Authentication error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('[SERVER LOGIN] Authentication successful');

    // Get the profile to determine redirect
    const {
      data: { user }
    } = await locals.supabase.auth.getUser();

    console.log('[SERVER LOGIN] User fetched:', user?.id);

    if (user) {
      const { data: profile } = await locals.supabase
        .from('users_profile')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('[SERVER LOGIN] Profile fetched:', profile);

      if (profile?.role === 'admin') {
        console.log('[SERVER LOGIN] Redirecting to admin dashboard');
        throw redirect(303, '/admin-dashboard');
      }
    }

    console.log('[SERVER LOGIN] Redirecting to course');
    throw redirect(303, '/course');
  },

  forgotPassword: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    if (!email) {
      return {
        type: 'forgotPassword',
        success: false,
        error: 'Email is required'
      };
    }

    const { error } = await locals.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${url.origin}/reset-password`
    });

    if (error) {
      return {
        type: 'forgotPassword',
        success: false,
        error: error.message
      };
    }

    return {
      type: 'forgotPassword',
      success: true,
      message: 'Password reset email sent. Please check your inbox.'
    };
  }
};
