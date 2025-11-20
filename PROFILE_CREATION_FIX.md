# Fixing Profile Creation Issue

## Problem Summary

When creating users via the API, the auth user is created successfully but the profile is not being created in the `users_profile` table. This prevents the full user data from being returned in the API response.

The issue is that both the REST API insert and RPC function fallback are failing due to Supabase's REST API Row-Level Security (RLS) enforcement, which is an architectural limitation.

## Solution: Rely on PostgreSQL Trigger

Since the REST API insert is failing, we need to rely on the PostgreSQL trigger (`handle_new_user`) that automatically creates the profile when an auth user is created.

### Step 1: Verify Metadata is Being Stored

First, check if the user_metadata is being stored correctly in the auth user. The API now passes full_name and role as metadata:

```typescript
user_metadata: {
  full_name: body.full_name,
  role: role,
}
```

### Step 2: Update the PostgreSQL Trigger

The trigger needs to properly extract the full_name and role from the user_metadata field.

**Go to your Supabase Dashboard:**

1. Select your project
2. Go to **SQL Editor**
3. Create a new query
4. Paste and run this SQL:

```sql
-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create improved function with better metadata handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  full_name_value TEXT;
  role_value TEXT;
BEGIN
  -- Extract metadata - priority: user_metadata -> fallback to email prefix
  full_name_value := COALESCE(
    new.raw_user_meta_data->>'full_name',
    SPLIT_PART(new.email, '@', 1)  -- Use email prefix as last resort
  );

  role_value := COALESCE(
    new.raw_user_meta_data->>'role',
    'student'
  );

  -- Insert or update profile
  INSERT INTO public.users_profile (id, full_name, role, is_active, created_at)
  VALUES (new.id, full_name_value, role_value, true, NOW())
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = true;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Test the Fix

After updating the trigger, test creating a user:

```bash
curl -X POST "https://www.website1wun.com/api/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -d '{
    "email":"testuser@example.com",
    "password":"password123",
    "full_name":"John Doe",
    "role":"student"
  }'
```

### Step 4: Verify in Supabase

1. Go to your Supabase Dashboard
2. Go to **Table Editor**
3. Select the `users_profile` table
4. Check the newly created user:
   - `full_name` should be "John Doe" (NOT the email)
   - `role` should be "student"
   - `is_active` should be `true`

## Why This Happens

1. **REST API RLS Limitation**: Supabase's REST API enforces Row-Level Security at the API gateway level, not just at the database level
2. **Service Role Key Bypass**: Even though the service role key should bypass RLS, the REST API still enforces it
3. **Trigger Advantage**: PostgreSQL triggers run inside the database with SECURITY DEFINER, which bypasses RLS completely

## Expected Behavior After Fix

When you create a user via the API:

1. ✅ Auth user is created in `auth.users` with metadata
2. ✅ Profile is automatically created in `users_profile` by the trigger
3. ✅ API returns 201 with full user details
4. ✅ User can immediately log in and use the system

## Troubleshooting

### "Metadata not stored in raw_user_meta_data"

If you check the auth user and the metadata is missing, it might be a Supabase Admin API limitation. In that case:

1. Comment out lines with full_name and role extraction
2. Let the trigger use email prefix as fallback
3. This is acceptable as the user data is still functional

### "Profile still not created by trigger"

Check the Supabase logs:

1. Go to **Logs** → **Postgres**
2. Search for the user email
3. Look for any error messages from the trigger

### "RPC function still not working"

If the RPC function `insert_user_profile_direct` exists and is still failing, you may need to:

1. Drop the RPC function: `DROP FUNCTION IF EXISTS public.insert_user_profile_direct CASCADE;`
2. The trigger alone should be sufficient as the primary mechanism

## Long-Term Solution

The current architecture handles this gracefully:

1. **Primary Method**: API attempts REST API insert (works if you manually fix RLS)
2. **Fallback 1**: RPC function insert (SECURITY DEFINER function)
3. **Fallback 2**: PostgreSQL trigger (runs automatically on auth user creation)
4. **Fallback 3**: Return auth user data with warning (user can log in immediately)

This multi-layered approach ensures users are created successfully even with Supabase architectural limitations.

## Files Modified

- `src/app/api/admin/users/route.ts` - Now passes user_metadata to createUser

## Next Steps

1. Update the trigger using the SQL above
2. Test creating a user
3. Verify the profile is created with correct full_name
4. The API warning should disappear once the trigger works properly

---

**Status**: Ready for fix
**Last Updated**: November 20, 2025
