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
      role: (input.role as string).toUpperCase().trim(),
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

    // 5. Insert profile into users_profile table
    console.log(`📝 Creating profile for: ${userId}`);
    const { error: profileError } = await supabase
      .from('users_profile')
      .insert({
        id: userId,
        full_name,
        role,
      });

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError.message);

      // Try to clean up: delete the auth user we just created
      // (Optional - you can remove this if you prefer to leave orphaned users)
      console.log(`🧹 Attempting to delete orphaned auth user: ${userId}`);
      await supabase.auth.admin.deleteUser(userId).catch(deleteError => {
        console.warn('⚠️ Failed to delete orphaned user:', deleteError.message);
      });

      return NextResponse.json(
        { error: 'Failed to create user profile' },
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
 *   "role": "STUDENT"
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
