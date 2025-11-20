# Quick Start - Secure User API

## 5-Minute Setup

### Step 1: Database (1 min)

Copy-paste this SQL in Supabase SQL Editor:

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

Click "Run" ✅

### Step 2: Code (1 min)

Rename the new file:

```bash
mv src/app/api/admin/users/route-v2.ts src/app/api/admin/users/route.ts
```

Or backup old one first:

```bash
mv src/app/api/admin/users/route.ts src/app/api/admin/users/route-old.ts
mv src/app/api/admin/users/route-v2.ts src/app/api/admin/users/route.ts
```

### Step 3: Environment (1 min)

Generate a token:

```bash
openssl rand -hex 32
```

Add to `.env.local`:

```bash
ADMIN_BEARER_TOKEN=your_generated_token_here
```

Add to Vercel (Settings → Environment Variables):

```
ADMIN_BEARER_TOKEN=your_generated_token_here
```

### Step 4: Deploy (1 min)

```bash
git add .
git commit -m "Deploy secure user API"
git push
```

Vercel auto-deploys. Done! ✅

### Step 5: Test (1 min)

```bash
curl -X POST "https://www.website1wun.com/api/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123",
    "full_name": "Test User",
    "role": "STUDENT"
  }'
```

Should return:

```json
{
  "id": "uuid...",
  "email": "test@example.com",
  "full_name": "Test User",
  "role": "STUDENT"
}
```

## n8n Configuration

**HTTP Request Node:**

- **Method**: POST
- **URL**: https://www.website1wun.com/api/admin/users
- **Headers**:
  - `Authorization: Bearer YOUR_TOKEN`
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "{{ $json.email }}",
    "password": "{{ $json.password }}",
    "full_name": "{{ $json.full_name }}",
    "role": "{{ $json.role }}"
  }
  ```

---

## File Locations

- **API Code**: `src/app/api/admin/users/route.ts`
- **Full Docs**: `SECURE_USER_API.md`
- **Database SQL**: Already applied to your Supabase

---

Done! 🚀
