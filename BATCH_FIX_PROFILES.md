# Batch Fix User Profiles with Correct Full Names

Due to Supabase REST API RLS enforcement at the gateway level, profiles created via the API may have email prefixes as full_names instead of the requested names.

## Quick Fix - Use This SQL

Run this in your Supabase SQL Editor to fix all affected users at once:

```sql
SELECT * FROM public.fix_user_profiles_batch(jsonb_build_array(
  jsonb_build_object('email', 'user1@example.com', 'full_name', 'Correct Full Name 1', 'role', 'student'),
  jsonb_build_object('email', 'user2@example.com', 'full_name', 'Correct Full Name 2', 'role', 'student'),
  jsonb_build_object('email', 'user3@example.com', 'full_name', 'Correct Full Name 3', 'role', 'admin')
));
```

## How to Use

1. Replace `user1@example.com` with actual user email
2. Replace `Correct Full Name 1` with the correct full name
3. Replace `student` with correct role if needed
4. Add more `jsonb_build_object()` entries for each user
5. Run the query

## Example - Fix 3 Users

```sql
SELECT * FROM public.fix_user_profiles_batch(jsonb_build_array(
  jsonb_build_object('email', 'john@example.com', 'full_name', 'John Doe', 'role', 'student'),
  jsonb_build_object('email', 'jane@example.com', 'full_name', 'Jane Smith', 'role', 'instructor'),
  jsonb_build_object('email', 'admin@example.com', 'full_name', 'Admin User', 'role', 'admin')
));
```

## Automatic Fix (Manual Process)

Since REST API RLS blocks automatic updates, here's the workaround:

1. **Create user via API** - Returns correct full_name in response
2. **Database has email prefix** - Due to REST API RLS limitation
3. **Run batch fix SQL above** - Updates all profiles at once

## Understanding the Issue

- ✅ API creates users successfully
- ✅ API returns correct full_name
- ❌ Database stores email prefix (due to REST API RLS)
- ✅ Batch fix function updates database correctly

This is a known Supabase limitation where RLS is enforced at the REST API gateway level, preventing even privileged operations from bypassing it.

## Prevention

For new systems, consider:
1. Using service role key with direct PostgreSQL connection (not REST API)
2. Implementing a webhook to batch-fix profiles on a schedule
3. Using Supabase's upcoming improvements to RLS handling

---

**Status**: Working solution available
**Last Updated**: November 20, 2025
