import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { getCurrentUserWithProfile } from '@/lib/auth';

type AdminUserDto = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'ADMIN' | 'STUDENT';
  is_active?: boolean;
  created_at: string;
};

type UpdateUserRequest = {
  full_name?: string;
  role?: 'ADMIN' | 'STUDENT';
  is_active?: boolean;
  password?: string;
};

// Helper function to check admin authorization and get Supabase client
async function getAdminSupabaseClient(request: NextRequest): Promise<{ isAdmin: boolean; supabase: any }> {
  // Check for API key first (for external tools like n8n)
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (apiKey === process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
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

// GET /api/admin/users/[userId] - Get a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Check admin authorization and get appropriate Supabase client
    const { isAdmin, supabase } = await getAdminSupabaseClient(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { userId } = await params;

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get auth user email
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);

    if (authError) {
      console.error('Auth user fetch error:', authError);
      return NextResponse.json(
        { error: 'Failed to fetch user details' },
        { status: 500 }
      );
    }

    const responseUser: AdminUserDto = {
      id: profile.id,
      email: authUser.user?.email || null,
      full_name: profile.full_name,
      role: profile.role as 'ADMIN' | 'STUDENT',
      ...(profile.is_active !== null && { is_active: profile.is_active }),
      created_at: profile.created_at,
    };

    return NextResponse.json(responseUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[userId] - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Check admin authorization and get appropriate Supabase client
    const { isAdmin, supabase } = await getAdminSupabaseClient(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const body: UpdateUserRequest = await request.json();
    const { userId } = await params;

    // Validate input
    if (body.role && !['ADMIN', 'STUDENT'].includes(body.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN or STUDENT' },
        { status: 400 }
      );
    }

    if (body.password && body.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('users_profile')
      .select('id')
      .eq('id', userId)
      .single();

    if (fetchError || !existingProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update auth user if password is provided
    if (body.password) {
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        password: body.password,
      });

      if (authError) {
        console.error('Auth user update error:', authError);
        return NextResponse.json(
          { error: 'Failed to update password' },
          { status: 500 }
        );
      }
    }

    // Prepare profile update data
    const updateData: Record<string, any> = {};
    if (body.full_name !== undefined) updateData.full_name = body.full_name;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    // Update user profile
    const { data: updatedProfile, error: profileError } = await supabase
      .from('users_profile')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (profileError) {
      console.error('Profile update error:', profileError);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Get auth user email
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);

    const responseUser: AdminUserDto = {
      id: updatedProfile.id,
      email: authUser.user?.email || null,
      full_name: updatedProfile.full_name,
      role: updatedProfile.role as 'ADMIN' | 'STUDENT',
      ...(updatedProfile.is_active !== null && { is_active: updatedProfile.is_active }),
      created_at: updatedProfile.created_at,
    };

    return NextResponse.json(responseUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[userId] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Check admin authorization and get appropriate Supabase client
    const { isAdmin, supabase } = await getAdminSupabaseClient(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { userId } = await params;

    // Check if user exists
    const { data: profile, error: fetchError } = await supabase
      .from('users_profile')
      .select('id')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user profile first
    const { error: profileError } = await supabase
      .from('users_profile')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Profile deletion error:', profileError);
      return NextResponse.json(
        { error: 'Failed to delete user profile' },
        { status: 500 }
      );
    }

    // Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Auth user deletion error:', authError);
      // Profile is already deleted, but we should log this error
      return NextResponse.json(
        { error: 'User profile deleted but auth account deletion failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
