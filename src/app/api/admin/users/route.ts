import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Type definitions
interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  role: string;
}

interface ValidationError {
  [key: string]: string;
}

interface SuccessResponse {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface ErrorResponse {
  error: string;
  details?: ValidationError;
}

// Helper: Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper: Validate request body
function validateInput(body: unknown): { valid: boolean; errors?: ValidationError; data?: CreateUserRequest } {
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { body: 'Request body must be valid JSON' } };
  }

  const input = body as Record<string, unknown>;
  const errors: ValidationError = {};

  // Email validation
  if (!input.email || typeof input.email !== 'string' || !isValidEmail(input.email)) {
    errors.email = 'Email is required and must be a valid email address';
  }

  // Password validation (at least 8 characters)
  if (!input.password || typeof input.password !== 'string' || input.password.length < 8) {
    errors.password = 'Password is required and must be at least 8 characters';
  }

  // Full name validation
  if (!input.full_name || typeof input.full_name !== 'string' || input.full_name.trim().length === 0) {
    errors.full_name = 'Full name is required and cannot be empty';
  }

  // Role validation
  if (!input.role || typeof input.role !== 'string' || input.role.trim().length === 0) {
    errors.role = 'Role is required and cannot be empty';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      email: (input.email as string).toLowerCase(),
      password: input.password as string,
      full_name: (input.full_name as string).trim(),
      role: (input.role as string).toLowerCase().trim(),
    },
  };
}

// Helper: Verify bearer token
function verifyBearerToken(authHeader: string | null): boolean {
  if (!authHeader) return false;

  const expectedToken = process.env.ADMIN_BEARER_TOKEN;
  if (!expectedToken) {
    console.warn('⚠️ ADMIN_BEARER_TOKEN not configured');
    return false;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return false;
  }

  const token = parts[1];
  return token === expectedToken;
}

// Type definitions for GET response
interface ListUserResponse {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface ListUsersResponse {
  data: ListUserResponse[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

// Helper: Validate query parameters for GET
function validateListQuery(searchParams: URLSearchParams): { valid: boolean; errors?: string; limit?: number; offset?: number; role?: string; is_active?: boolean; search?: string; sort_by?: string; sort_order?: string } {
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
  const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);
  const role = searchParams.get('role');
  const is_active = searchParams.get('is_active');
  const search = searchParams.get('search');
  const sort_by = searchParams.get('sort_by') || 'created_at';
  const sort_order = searchParams.get('sort_order') || 'desc';

  // Validate limit
  if (isNaN(limit) || limit < 1) {
    return { valid: false, errors: 'limit must be a positive number (max 100)' };
  }

  // Validate offset
  if (isNaN(offset) || offset < 0) {
    return { valid: false, errors: 'offset must be a non-negative number' };
  }

  // Validate role
  if (role && !['admin', 'student', 'instructor'].includes(role.toLowerCase())) {
    return { valid: false, errors: 'role must be admin, student, or instructor' };
  }

  // Validate is_active
  let is_active_parsed: boolean | undefined;
  if (is_active !== null) {
    if (!['true', 'false'].includes(is_active.toLowerCase())) {
      return { valid: false, errors: 'is_active must be true or false' };
    }
    is_active_parsed = is_active.toLowerCase() === 'true';
  }

  // Validate sort_by
  if (!['created_at', 'email', 'full_name'].includes(sort_by)) {
    return { valid: false, errors: 'sort_by must be created_at, email, or full_name' };
  }

  // Validate sort_order
  if (!['asc', 'desc'].includes(sort_order.toLowerCase())) {
    return { valid: false, errors: 'sort_order must be asc or desc' };
  }

  return {
    valid: true,
    limit,
    offset,
    role: role?.toLowerCase() || undefined,
    is_active: is_active_parsed,
    search: search || undefined,
    sort_by,
    sort_order: sort_order.toLowerCase(),
  };
}

// Main GET handler - List users
export async function GET(request: NextRequest): Promise<NextResponse<ListUsersResponse | ErrorResponse>> {
  try {
    // 1. Check authorization
    const authHeader = request.headers.get('Authorization');
    if (!verifyBearerToken(authHeader)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Validate query parameters
    const { searchParams } = new URL(request.url);
    const validation = validateListQuery(searchParams);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: { params: validation.errors || 'Invalid parameters' } },
        { status: 400 }
      ) as NextResponse<ListUsersResponse | ErrorResponse>;
    }

    const { limit: pageLimit, offset: pageOffset, role: filterRole, is_active: filterActive, search: searchTerm, sort_by: sortBy, sort_order: sortOrder } = validation;

    // Ensure values are not undefined
    const limit = pageLimit || 10;
    const offset = pageOffset || 0;
    const role = filterRole;
    const is_active = filterActive;
    const search = searchTerm;
    const sort_by = sortBy || 'created_at';
    const sort_order = sortOrder || 'desc';

    // 3. Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('❌ Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 4. Build query
    let query = supabase
      .from('users_profile')
      .select('id, full_name, role, is_active, created_at, email', { count: 'exact' });

    // 5. Apply filters
    if (role) {
      query = query.eq('role', role);
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      query = query.or(`email.ilike.%${searchLower}%,full_name.ilike.%${searchLower}%`);
    }

    // 6. Apply sorting
    const ascending = sort_order === 'asc';
    query = query.order(sort_by as any, { ascending });

    // 7. Apply pagination
    query = query.range(offset, offset + limit - 1);

    // 8. Execute query
    console.log(`📋 Fetching users: limit=${limit}, offset=${offset}, role=${role}, is_active=${is_active}, search=${search}`);
    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Query failed:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // 9. Format response
    const users: ListUserResponse[] = (data || []).map(user => ({
      id: user.id,
      email: user.email || '',
      full_name: user.full_name || '',
      role: user.role,
      is_active: user.is_active ?? true,
      created_at: user.created_at,
    }));

    const totalCount = count || 0;
    const has_more = offset + limit < totalCount;

    const response: ListUsersResponse = {
      data: users,
      pagination: {
        total: totalCount,
        limit,
        offset,
        has_more,
      },
    };

    console.log(`✅ Fetched ${users.length} users (total: ${totalCount})`);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Main POST handler
export async function POST(request: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // 1. Check authorization
    const authHeader = request.headers.get('Authorization');
    if (!verifyBearerToken(authHeader)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid input', details: { body: 'Request body must be valid JSON' } },
        { status: 400 }
      );
    }

    const validation = validateInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { email, password, full_name, role } = validation.data!;

    // 3. Create Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('❌ Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 4. Create auth user with metadata
    console.log(`📝 Creating auth user for: ${email}`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm so they can log in immediately
      user_metadata: {
        full_name,
        role,
      },
    });

    if (authError || !authData.user) {
      console.error('❌ Auth user creation failed:', authError?.message);
      console.error('Auth error details:', JSON.stringify(authError, null, 2));

      // Handle specific error: user already exists
      if (authError?.message?.includes('already exists') || authError?.message?.includes('already registered')) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;
    console.log(`✅ Auth user created: ${userId}`);

    // 5. Create profile using RPC function (bypasses REST API RLS limitations)
    console.log(`📝 Creating profile for: ${userId}`);
    const { error: profileError, data: profileData } = await supabase
      .rpc('create_user_profile', {
        user_id: userId,
        user_full_name: full_name,
        user_role: role,
      });

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError.message);
      console.error('Profile error details:', JSON.stringify(profileError, null, 2));

      // Try to clean up: delete the auth user we just created
      console.log(`🧹 Attempting to delete orphaned auth user: ${userId}`);
      await supabase.auth.admin.deleteUser(userId).catch(deleteError => {
        console.warn('⚠️ Failed to delete orphaned user:', deleteError.message);
      });

      return NextResponse.json(
        { error: 'Failed to create user profile', details: { profile: profileError.message } },
        { status: 500 }
      );
    }

    console.log(`✅ Profile created: ${userId}`);

    // 6. Return success response
    const response: SuccessResponse = {
      id: userId,
      email,
      full_name,
      role,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * ========================================
 * GET /api/admin/users - List all users
 * ========================================
 *
 * EXAMPLE n8n HTTP Request Node Configuration
 *
 * Method: GET
 * URL: https://www.website1wun.com/api/admin/users?limit=10&offset=0
 *
 * Headers:
 * - Authorization: Bearer {{ $env.ADMIN_BEARER_TOKEN }}
 *
 * Query Parameters (all optional):
 * - limit: Number of users per page (1-100, default: 10)
 * - offset: Number of users to skip (default: 0)
 * - role: Filter by role (admin, student, instructor)
 * - is_active: Filter by active status (true, false)
 * - search: Search by email or full_name (partial match)
 * - sort_by: Sort field (created_at, email, full_name - default: created_at)
 * - sort_order: Sort direction (asc, desc - default: desc)
 *
 * Examples:
 * - Get first 10 users: ?limit=10&offset=0
 * - Get all students: ?role=student&limit=100
 * - Search by email: ?search=john@example.com&limit=20
 * - Get active admins: ?role=admin&is_active=true&limit=50
 * - Get users sorted by name: ?sort_by=full_name&sort_order=asc
 *
 * Expected Response (200):
 * {
 *   "data": [
 *     {
 *       "id": "550e8400-e29b-41d4-a716-446655440000",
 *       "email": "user@example.com",
 *       "full_name": "John Doe",
 *       "role": "student",
 *       "is_active": true,
 *       "created_at": "2024-01-15T10:30:00Z"
 *     }
 *   ],
 *   "pagination": {
 *     "total": 150,
 *     "limit": 10,
 *     "offset": 0,
 *     "has_more": true
 *   }
 * }
 *
 * Error Response Examples:
 *
 * 401 Unauthorized:
 * { "error": "Unauthorized" }
 *
 * 400 Bad Request:
 * {
 *   "error": "Invalid query parameters",
 *   "details": { "params": "limit must be a positive number (max 100)" }
 * }
 *
 * 500 Server Error:
 * { "error": "Failed to fetch users" }
 *
 * ========================================
 * POST /api/admin/users - Create new user
 * ========================================
 *
 * EXAMPLE n8n HTTP Request Node Configuration
 *
 * Method: POST
 * URL: https://www.website1wun.com/api/admin/users
 *
 * Headers:
 * - Authorization: Bearer {{ $env.ADMIN_BEARER_TOKEN }}
 * - Content-Type: application/json
 *
 * Body (JSON):
 * {
 *   "email": "{{ $json.email }}",
 *   "password": "{{ $json.password }}",
 *   "full_name": "{{ $json.full_name }}",
 *   "role": "{{ $json.role }}"
 * }
 *
 * Expected Response (201):
 * {
 *   "id": "550e8400-e29b-41d4-a716-446655440000",
 *   "email": "user@example.com",
 *   "full_name": "John Doe",
 *   "role": "student"
 * }
 *
 * Error Response Examples:
 *
 * 401 Unauthorized:
 * { "error": "Unauthorized" }
 *
 * 400 Bad Request:
 * {
 *   "error": "Invalid input",
 *   "details": {
 *     "email": "Email is required and must be a valid email address",
 *     "password": "Password is required and must be at least 8 characters"
 *   }
 * }
 *
 * 409 Conflict (email exists):
 * { "error": "Email already exists" }
 *
 * 500 Server Error:
 * { "error": "Failed to create user profile" }
 */
