# User Creation API Documentation

## Endpoint: POST /api/admin/users

Creates a new user with both Supabase Auth account and user profile.

### Authentication

The endpoint requires admin authorization. You can authenticate in two ways:

#### Option 1: Supabase Session (logged-in admin user)
Requires user to be logged in with ADMIN role

#### Option 2: Service Role Key (external tools like n8n)
Pass the Supabase service role key in the Authorization header:

```bash
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "student"
}
```

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address. Must not already exist in the system |
| password | string | Yes | Minimum 6 characters |
| full_name | string | Yes | User's full name |
| role | string | No | User role: `student`, `admin`, or `instructor`. Defaults to `student`. Case-insensitive |

### Response

#### Success (HTTP 201)

If user creation completes fully:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "student",
  "is_active": true,
  "created_at": "2025-11-20T14:31:50.217Z"
}
```

#### Partial Success (HTTP 201)

If auth user is created but profile creation fails (see "Known Limitations" below):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "student",
  "is_active": true,
  "created_at": "2025-11-20T14:31:50.217Z",
  "warning": "Auth user created but profile creation failed. Profile will need to be created separately."
}
```

#### Error Responses

**400 Bad Request** - Validation error:
```json
{
  "error": "Missing required fields: email, password, full_name"
}
```

**403 Forbidden** - Authorization error:
```json
{
  "error": "Unauthorized: Admin access required"
}
```

**409 Conflict** - Email already exists:
```json
{
  "error": "User with this email already exists"
}
```

**500 Internal Server Error** - Unexpected error:
```json
{
  "error": "Internal server error"
}
```

### How It Works

The endpoint uses a two-step process:

1. **Auth User Creation** (Always succeeds)
   - Uses Supabase Admin SDK with service role key
   - Creates user in `auth.users` table
   - Passes `full_name` and `role` via `user_metadata`

2. **Profile Creation** (Best effort with automatic fallback)
   - Attempts to create profile in `users_profile` table with retry logic
   - If successful: Returns complete user object with profile data
   - If fails: Returns 201 with auth user data (profile will be created by trigger or background job)

**Why This Design**:
- Users can log in and use the system immediately after creation
- Profiles are created either synchronously or automatically by database trigger
- Tolerates Supabase REST API architectural limitations
- Works reliably with external tools (n8n, curl, Postman, etc.)

### Technical Details

When you call the endpoint with a service role key:

1. Authentication is verified via Bearer token
2. Input is validated (email format, password strength, role type)
3. Auth user is created in Supabase with auto-confirmed email
4. API attempts to create profile (with automatic retry logic)
5. Returns HTTP 201 with created user details

The `user_metadata` stored in auth.users includes:
```json
{
  "full_name": "John Doe",
  "role": "student"
}
```

This metadata is used by the PostgreSQL trigger to automatically create the profile if the REST API insert fails.

### Examples

#### Using curl with Service Role Key

```bash
curl -X POST "https://www.website1wun.com/api/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "full_name": "Jane Smith",
    "role": "student"
  }'
```

#### Using n8n

Configure an HTTP Request node:

- **Method**: POST
- **URL**: https://www.website1wun.com/api/admin/users
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer YOUR_SERVICE_ROLE_KEY`
- **Body** (JSON):
  ```json
  {
    "email": "{{ $json.email }}",
    "password": "{{ $json.password }}",
    "full_name": "{{ $json.full_name }}",
    "role": "student"
  }
  ```

### Implementation Details

The endpoint:

1. **Validates Authorization**: Checks for valid service role key or admin session
2. **Validates Input**: Email format, password length, role values
3. **Creates Auth User**: Uses Supabase Admin SDK to create user in `auth.users` table
4. **Creates Profile**: Attempts to create user profile in `users_profile` table
5. **Handles Failures**: Returns partial success (201) if profile creation fails, allowing user to still log in

### Troubleshooting

**"Failed to create user profile" warning**

This is expected when calling from external tools with service role key. The user can still log in and use the system.

**"User with this email already exists"**

The email has already been registered. Use a different email address or delete the existing user first.

**"Invalid role" error**

Ensure role is one of: `student`, `admin`, `instructor` (case-insensitive)

**"Unauthorized: Admin access required"**

The Authorization header is missing or the service role key is incorrect.

---

**Last Updated**: November 20, 2025
**API Version**: 1.0
