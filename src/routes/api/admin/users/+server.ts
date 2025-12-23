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

    // Create user in Supabase Auth with metadata
    // The on_auth_user_created trigger will automatically create the profile
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: full_name || email,
        role: role // Include role in metadata so trigger can use it
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Wait a moment for the trigger to complete and fetch the created profile
    await new Promise(resolve => setTimeout(resolve, 100));

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users_profile')
      .select('id, email, full_name, role')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError);

      // Cleanup: delete auth user if profile wasn't created
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      return json({ error: 'Failed to create user profile' }, { status: 500 });
    }

    return json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
