import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY, ADMIN_BEARER_TOKEN } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

// Create admin client with service role key
const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Validate Bearer token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (token !== ADMIN_BEARER_TOKEN) {
      return json({ error: 'Invalid authorization token' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { email, password, full_name, role = 'student' } = body;

    // Validate required fields
    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: full_name || email
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Create user profile in users_profile table
    const { error: profileError } = await supabaseAdmin
      .from('users_profile')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: full_name || email,
        role: role,
        is_active: true
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);

      // Cleanup: delete auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      return json({ error: 'Failed to create user profile: ' + profileError.message }, { status: 500 });
    }

    return json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: full_name || email,
        role: role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
