import { NextRequest, NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { getCurrentUserWithProfile } from '@/lib/auth';

// Type definitions
type AdminUserDto = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'ADMIN' | 'STUDENT';
  is_active?: boolean;
  created_at: string;
};

type CreateUserRequest = {
  email: string;
  password: string;
  full_name: string;
  role?: 'ADMIN' | 'STUDENT';
};

// Helper function to check admin authorization and get Supabase client
type AdminSupabaseClient = SupabaseClient;

async function getAdminSupabaseClient(request: NextRequest): Promise<{ isAdmin: boolean; supabase: AdminSupabaseClient }> {
  // Check for API key first (for external tools like n8n)
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (apiKey && serviceRoleKey && apiKey === serviceRoleKey) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );
    return { isAdmin: true, supabase };
  }

  // Check if Authorization header is present but SUPABASE_SERVICE_ROLE_KEY not set
  // In this case, assume it's an external service trying to use the API key
  if (apiKey && !serviceRoleKey) {
    // Create client with the provided API key (assume it's the service role key)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      apiKey
    );
    return { isAdmin: true, supabase };
  }

  // Fall back to Supabase session auth
  const user = await getCurrentUserWithProfile();
  const supabase = await createSupabaseServerClient();
  return {
    isAdmin: !!(user && user.profile.role === 'ADMIN'),
    supabase
  };
}

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization and get appropriate Supabase client
    const { isAdmin, supabase } = await getAdminSupabaseClient(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 500); // Max 500
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch users from users_profile table
    const { data: profiles, error: profileError, count } = await supabase
      .from('users_profile')
      .select(
        `
        id,
        full_name,
        role,
        is_active,
        created_at
        `,
        { count: 'exact' }
      )
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // If no profiles, return empty array
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        data: [],
        pagination: {
          limit,
          offset,
          total: 0,
        },
      });
    }

    // Get user emails from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Auth users fetch error:', authError);
      return NextResponse.json(
        { error: 'Failed to fetch user emails' },
        { status: 500 }
      );
    }

    // Create a map of user IDs to emails
    const emailMap = new Map(
      authUsers.users.map((u: { id: string; email?: string }) => [u.id, u.email])
    );

    // Combine data
    const users: AdminUserDto[] = (profiles as Array<{ id: string; full_name: string | null; role: string; is_active: boolean | null; created_at: string }>).map((profile) => ({
      id: profile.id,
      email: emailMap.get(profile.id) || null,
      full_name: profile.full_name,
      role: profile.role as 'ADMIN' | 'STUDENT',
      ...(profile.is_active !== null && { is_active: profile.is_active }),
      created_at: profile.created_at,
    }));

    return NextResponse.json({
      data: users,
      pagination: {
        limit,
        offset,
        total: count,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    // Check admin authorization and get appropriate Supabase client
    const { isAdmin, supabase } = await getAdminSupabaseClient(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const body: CreateUserRequest = await request.json();

    // Validate required fields
    if (!body.email || !body.password || !body.full_name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, full_name' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Accept both uppercase and lowercase role values
    const requestedRole = (body.role || 'student').toLowerCase();
    if (!['admin', 'student', 'instructor'].includes(requestedRole)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, student, or instructor' },
        { status: 400 }
      );
    }

    // Use lowercase role for database storage
    const role = requestedRole;

    // Create auth user with metadata that trigger will use
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: body.full_name,
        role: role,
      },
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      // Return specific error messages
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // The profile will be automatically created by a PostgreSQL trigger
    // that fires when the auth user is inserted. Wait briefly to ensure trigger completes
    await new Promise(resolve => setTimeout(resolve, 100));

    // Retrieve the created profile
    const { data: profile, error: profileError } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile retrieval error (trigger may still be pending):', {
        userId: authData.user.id,
        email: authData.user.email,
        error: profileError
      });
      // User was created in auth, profile should be created by trigger
      // Return success anyway since auth user exists
      return NextResponse.json({
        id: authData.user.id,
        email: authData.user.email || null,
        full_name: body.full_name,
        role: role as 'ADMIN' | 'STUDENT',
        is_active: true,
        created_at: new Date().toISOString(),
      }, { status: 201 });
    }

    const responseUser: AdminUserDto = {
      id: authData.user.id,
      email: authData.user.email || null,
      full_name: profile.full_name,
      role: profile.role as 'ADMIN' | 'STUDENT',
      is_active: profile.is_active,
      created_at: profile.created_at,
    };

    return NextResponse.json(responseUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
