# Deployment Checklist - Secure User API

## Complete Setup & Deployment Guide

---

## Phase 1: Database Setup (5 min)

### ✅ Step 1.1: Create Profiles Table

Go to **Supabase Dashboard** → **SQL Editor**

Paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

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

Click **Run** ✅

### ✅ Step 1.2: Verify Creation

Run this to confirm:

```sql
SELECT tablename FROM pg_tables WHERE tablename = 'profiles';
```

Should return: `profiles` ✅

---

## Phase 2: Generate Bearer Token (2 min)

### ✅ Step 2.1: Create Secure Token

Run in terminal:

```bash
openssl rand -hex 32
```

Example output:
```
5f3a8e9c2d1b4a6f7e8c9d0a1b2c3d4e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c
```

**Copy this token - you'll need it twice**

---

## Phase 3: Code Deployment (3 min)

### ✅ Step 3.1: Rename Route File

```bash
# Option A: If you have an old route file, back it up first
mv src/app/api/admin/users/route.ts src/app/api/admin/users/route-old.ts

# Option B: Just rename the new one
mv src/app/api/admin/users/route-v2.ts src/app/api/admin/users/route.ts
```

### ✅ Step 3.2: Add Local Environment Variable

Edit `.env.local`:

```bash
# Add this line:
ADMIN_BEARER_TOKEN=YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the token from Step 2.1

### ✅ Step 3.3: Commit & Push

```bash
git add .
git commit -m "Deploy secure user creation API with profiles table"
git push origin main
```

---

## Phase 4: Vercel Setup (2 min)

### ✅ Step 4.1: Add Environment Variable

1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
   - **Name**: `ADMIN_BEARER_TOKEN`
   - **Value**: Your token from Step 2.1
5. Click **Save**

### ✅ Step 4.2: Wait for Deployment

Vercel automatically redeploys when you push.

Check **Deployments** tab - should show "Ready" in ~1-2 min ✅

---

## Phase 5: Testing (3 min)

### ✅ Step 5.1: Test with curl

```bash
curl -X POST "https://www.website1wun.com/api/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "full_name": "Test User",
    "role": "STUDENT"
  }'
```

Replace `YOUR_TOKEN` with your actual token.

**Expected Response (201)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "test@example.com",
  "full_name": "Test User",
  "role": "STUDENT"
}
```

### ✅ Step 5.2: Verify in Supabase

Go to **Supabase** → **Table Editor** → Select `profiles` table

Should see your test user with:
- **id**: (UUID)
- **full_name**: "Test User"
- **role**: "STUDENT"
- **created_at**: (timestamp)

✅ Success!

---

## Phase 6: n8n Integration (5 min)

### ✅ Step 6.1: Add Token to n8n

1. Go to **n8n Settings** (gear icon)
2. **Environment Variables**
3. **Add Variable**
   - **Name**: `ADMIN_BEARER_TOKEN`
   - **Value**: Your token
4. **Save**

### ✅ Step 6.2: Create HTTP Request Node

In your n8n workflow:

1. Add **HTTP Request** node
2. **Method**: `POST`
3. **URL**: `https://www.website1wun.com/api/admin/users`

### ✅ Step 6.3: Configure Headers

**Headers Tab**:

| Key | Value |
|-----|-------|
| `Authorization` | `Bearer {{ $env.ADMIN_BEARER_TOKEN }}` |
| `Content-Type` | `application/json` |

### ✅ Step 6.4: Configure Body

**Body Tab** → **JSON** → **Specify**:

```json
{
  "email": "{{ $json.email }}",
  "password": "{{ $json.password }}",
  "full_name": "{{ $json.full_name }}",
  "role": "{{ $json.role }}"
}
```

### ✅ Step 6.5: Test Node

Click **Execute Node** with test data:

```json
{
  "email": "n8n_test@example.com",
  "password": "N8nTestPass123",
  "full_name": "n8n Test User",
  "role": "STUDENT"
}
```

Should return 201 with user data ✅

---

## Final Verification Checklist

- [ ] ✅ Profiles table created in Supabase
- [ ] ✅ RLS policies applied
- [ ] ✅ `route.ts` file deployed
- [ ] ✅ `ADMIN_BEARER_TOKEN` in `.env.local`
- [ ] ✅ `ADMIN_BEARER_TOKEN` in Vercel
- [ ] ✅ Vercel deployment shows "Ready"
- [ ] ✅ curl test returns 201 with user data
- [ ] ✅ User visible in Supabase profiles table
- [ ] ✅ n8n HTTP node configured
- [ ] ✅ n8n test successful

---

## Troubleshooting

### Issue: curl returns 401 "Unauthorized"

**Solution**:
1. Check token is correct (matches in Vercel)
2. Verify format: `Bearer TOKEN_HERE` (space required)
3. Check `.env.local` has `ADMIN_BEARER_TOKEN=...`

### Issue: curl returns 400 "Invalid input"

**Solution**:
1. Check email format: `user@example.com`
2. Check password length: minimum 8 characters
3. Check full_name is non-empty
4. Check role is non-empty

### Issue: curl returns 409 "Email already exists"

**Solution**:
- Email is already registered
- Use a different email or delete the existing user in Supabase

### Issue: curl returns 500 "Failed to create user profile"

**Solution**:
1. Verify `profiles` table exists in Supabase
2. Check RLS policies are correct
3. View Vercel logs for detailed error

### Issue: Vercel shows old code

**Solution**:
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check Vercel deployment status
3. Try manually triggering redeploy: **Vercel Dashboard** → **Deployments** → **Redeploy**

---

## Monitoring & Logs

### View Vercel Logs

1. **Vercel Dashboard** → Select project
2. **Deployments** → Click active deployment
3. **Logs** tab → Filter for POST requests to `/api/admin/users`

### Log Output Examples

**Success**:
```
📝 Creating auth user for: test@example.com
✅ Auth user created: 550e8400-...
📝 Creating profile for: 550e8400-...
✅ Profile created: 550e8400-...
```

**Error**:
```
❌ Auth user creation failed: User already exists
```

---

## Security Reminders

⚠️ **DO NOT**:
- Share your `ADMIN_BEARER_TOKEN` publicly
- Commit token to GitHub (use environment variables)
- Expose service role key to client code
- Log sensitive data in production

✅ **DO**:
- Store token in `.env.local` and Vercel only
- Use HTTPS (enforced by Vercel)
- Validate all inputs server-side
- Monitor logs for suspicious activity

---

## Support Resources

| Problem | Resource |
|---------|----------|
| General setup | `QUICK_START_SECURE_API.md` |
| Full reference | `SECURE_USER_API.md` |
| Overview | `API_SUMMARY.md` |
| Code | `src/app/api/admin/users/route.ts` |

---

## Summary

| Phase | Time | Status |
|-------|------|--------|
| Database | 5 min | ✅ |
| Token | 2 min | ✅ |
| Code | 3 min | ✅ |
| Vercel | 2 min | ✅ |
| Testing | 3 min | ✅ |
| n8n | 5 min | ✅ |
| **Total** | **20 min** | **✅ Complete** |

---

**Ready to go live!** 🚀

**Questions?** Check the documentation files or Vercel logs.
