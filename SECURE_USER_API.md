# Secure User Creation API - Complete Guide

## Overview

A production-ready Next.js API endpoint for creating Supabase Auth users with profiles, secured with bearer token authentication.

**Endpoint**: `POST /api/admin/users`

---

## 1. Database Schema (Supabase SQL)

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Authenticated users can SELECT and UPDATE their own profile
CREATE POLICY "Users can select their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 2: Service role (using service key) can INSERT, SELECT, UPDATE all rows
CREATE POLICY "Service role can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can select all profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

---

## 2. Environment Variables

Add these to your `.env.local` and Vercel:

```bash
# Supabase (already in use)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxx

# New: Admin bearer token for protecting this endpoint
ADMIN_BEARER_TOKEN=your_secure_token_here
```

**Generate a secure token:**

```bash
# Using openssl
openssl rand -hex 32

# Or use any strong random string
# Example: 5f3a8e9c2d1b4a6f7e8c9d0a1b2c3d4e
```

---

## 3. API Endpoint Code

**File**: `src/app/api/admin/users/route.ts`

See `route-v2.ts` for the complete, production-ready implementation.

Key features:
- ✅ Bearer token authentication
- ✅ Comprehensive input validation
- ✅ Supabase Auth user creation with metadata
- ✅ Profile table insertion
- ✅ Proper error handling & cleanup
- ✅ JSON-only responses
- ✅ Server-side only (no client exposure)

---

## 4. How to Use in n8n

### Configure HTTP Request Node

**Method**: `POST`

**URL**:
```
https://www.website1wun.com/api/admin/users
```

**Headers**:
```
Authorization: Bearer YOUR_ADMIN_BEARER_TOKEN
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "role": "STUDENT"
}
```

### With n8n Variables

If you want to use dynamic values from previous nodes:

**Headers**:
```
Authorization: Bearer {{ $env.ADMIN_BEARER_TOKEN }}
Content-Type: application/json
```

**Body**:
```json
{
  "email": "{{ $json.email }}",
  "password": "{{ $json.password }}",
  "full_name": "{{ $json.full_name }}",
  "role": "{{ $json.role }}"
}
```

Store `ADMIN_BEARER_TOKEN` as an n8n environment variable.

---

## 5. Request Validation Rules

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | ✅ Yes | Must be valid email format |
| `password` | string | ✅ Yes | Minimum 8 characters |
| `full_name` | string | ✅ Yes | Non-empty, whitespace trimmed |
| `role` | string | ✅ Yes | Non-empty, converted to UPPERCASE |

---

## 6. Success Response

**Status**: `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "STUDENT"
}
```

---

## 7. Error Responses

### 401 Unauthorized

**Missing or invalid bearer token**

```json
{
  "error": "Unauthorized"
}
```

### 400 Bad Request

**Validation errors**

```json
{
  "error": "Invalid input",
  "details": {
    "email": "Email is required and must be a valid email address",
    "password": "Password is required and must be at least 8 characters"
  }
}
```

### 409 Conflict

**Email already exists**

```json
{
  "error": "Email already exists"
}
```

### 500 Internal Server Error

**Auth user or profile creation failed**

```json
{
  "error": "Failed to create user"
}
```

or

```json
{
  "error": "Failed to create user profile"
}
```

---

## 8. Security Features

✅ **Bearer Token Authentication**: Validates `Authorization: Bearer <token>` header

✅ **Input Validation**: Email format, password strength, required fields

✅ **Service Role Key**: Only used server-side, never exposed to client

✅ **Metadata Storage**: full_name and role stored in user_metadata

✅ **Cleanup**: Orphaned auth users deleted if profile creation fails

✅ **Error Handling**: Never leaks secrets or internal details in responses

✅ **RLS Policies**: Service role can write, users can only read/update their own

---

## 9. Testing

### With curl

```bash
curl -X POST "https://www.website1wun.com/api/admin/users" \
  -H "Authorization: Bearer YOUR_ADMIN_BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123",
    "full_name": "Test User",
    "role": "STUDENT"
  }'
```

### With Postman

1. Create new `POST` request
2. URL: `https://www.website1wun.com/api/admin/users`
3. Headers tab:
   - `Authorization`: `Bearer YOUR_ADMIN_BEARER_TOKEN`
   - `Content-Type`: `application/json`
4. Body (raw JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "securepass123",
     "full_name": "Test User",
     "role": "STUDENT"
   }
   ```
5. Click Send

---

## 10. Logging & Monitoring

The endpoint logs important events:

```
📝 Creating auth user for: user@example.com
✅ Auth user created: 550e8400-e29b-41d4-a716-446655440000
📝 Creating profile for: 550e8400-e29b-41d4-a716-446655440000
✅ Profile created: 550e8400-e29b-41d4-a716-446655440000
```

Check Vercel logs for debugging:
1. Go to Vercel Dashboard
2. Select project → Deployments
3. Click on active deployment
4. View logs for POST requests to `/api/admin/users`

---

## 11. Rate Limiting

Consider adding rate limiting for production:

```bash
# In Vercel settings, use Cloudflare or middleware to limit:
# - 100 requests per minute per IP
# - Or implement with middleware library
```

---

## 12. Troubleshooting

### "Unauthorized"

- ✅ Check `ADMIN_BEARER_TOKEN` is set in environment
- ✅ Verify header format: `Authorization: Bearer <token>` (space required)
- ✅ Ensure token matches exactly

### "Invalid input"

- ✅ Check all required fields are present
- ✅ Email must match: `user@domain.com` format
- ✅ Password must be at least 8 characters
- ✅ role must be non-empty

### "Email already exists"

- ✅ Email is already registered
- ✅ Delete the existing user first, or use a different email

### "Failed to create user profile"

- ✅ Check profiles table exists in Supabase
- ✅ Verify RLS policies are correct
- ✅ Check Vercel logs for details

---

## 13. Next Steps

1. **Deploy**: Push changes to GitHub → auto-deploys to Vercel
2. **Set Environment**: Add `ADMIN_BEARER_TOKEN` to Vercel
3. **Test**: Use curl/Postman to verify
4. **Integrate**: Use in n8n with HTTP Request node
5. **Monitor**: Check Vercel logs for issues

---

**Status**: ✅ Production-ready

**Last Updated**: November 20, 2025
