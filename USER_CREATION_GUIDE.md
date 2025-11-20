# Complete Guide: Creating User Accounts via API

This guide explains how to create user accounts in your Supabase-based LMS using HTTP requests from external tools like n8n, curl, Postman, or any other HTTP client.

## Quick Start

### With curl

```bash
curl -X POST "https://www.website1wun.com/api/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -d '{
    "email": "student@example.com",
    "password": "securepassword123",
    "full_name": "John Doe",
    "role": "student"
  }'
```

**Response (HTTP 201)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "student@example.com",
  "full_name": "John Doe",
  "role": "student",
  "is_active": true,
  "created_at": "2025-11-20T14:40:01.923Z"
}
```

### With Postman

1. **Create New Request**
   - Method: `POST`
   - URL: `https://www.website1wun.com/api/admin/users`

2. **Headers Tab**
   - Key: `Content-Type` → Value: `application/json`
   - Key: `Authorization` → Value: `Bearer YOUR_SERVICE_ROLE_KEY`

3. **Body Tab** (select "raw" and "JSON")
   ```json
   {
     "email": "student@example.com",
     "password": "securepassword123",
     "full_name": "John Doe",
     "role": "student"
   }
   ```

4. **Send** and check the response

### With n8n

Create an **HTTP Request** node:

**Configuration:**
- **Method**: `POST`
- **URL**: `https://www.website1wun.com/api/admin/users`
- **Authentication**: None (add headers manually)
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_SERVICE_ROLE_KEY
  ```

**Body**:
```json
{
  "email": "{{ $json.email }}",
  "password": "{{ $json.password }}",
  "full_name": "{{ $json.full_name }}",
  "role": "student"
}
```

## Getting Your Service Role Key

Your service role key is your **secret** admin key from Supabase.

**Where to find it:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Service Role key** (starts with `sb_secret_...`)

⚠️ **NEVER** share this key publicly or commit it to version control!

## API Endpoint Details

### URL
```
POST https://www.website1wun.com/api/admin/users
```

### Authentication
```
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

#### Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `email` | string | ✅ Yes | Valid email address. Must be unique | `john@example.com` |
| `password` | string | ✅ Yes | At least 6 characters | `securepass123` |
| `full_name` | string | ✅ Yes | User's full name | `John Doe` |
| `role` | string | ❌ No | One of: `student`, `admin`, `instructor`. Defaults to `student` | `student` |

### Success Response (HTTP 201)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "full_name": "John Doe",
  "role": "student",
  "is_active": true,
  "created_at": "2025-11-20T14:40:01.923Z"
}
```

### Error Responses

#### 400 Bad Request - Missing Fields
```json
{
  "error": "Missing required fields: email, password, full_name"
}
```

#### 400 Bad Request - Invalid Email
```json
{
  "error": "Invalid email format"
}
```

#### 400 Bad Request - Password Too Short
```json
{
  "error": "Password must be at least 6 characters"
}
```

#### 400 Bad Request - Invalid Role
```json
{
  "error": "Invalid role. Must be admin, student, or instructor"
}
```

#### 403 Forbidden - Invalid API Key
```json
{
  "error": "Unauthorized: Admin access required"
}
```

#### 409 Conflict - Email Already Exists
```json
{
  "error": "User with this email already exists"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## How It Works Behind the Scenes

### Two-Step Process

1. **Step 1: Create Auth User** ✅ Always succeeds
   - Uses Supabase Admin API
   - Creates user in `auth.users` table
   - Auto-confirms email (no email verification needed)
   - Email: Can immediately log in

2. **Step 2: Create Profile** 🔄 Best effort
   - Attempts to create user profile in `users_profile` table
   - Includes retry logic for reliability
   - If successful: Returns complete user data immediately
   - If fails: Returns 201 with message (profile created by trigger)

### User Metadata

When creating the auth user, the API stores metadata:

```json
{
  "full_name": "John Doe",
  "role": "student"
}
```

This metadata is accessible in your app as:

```javascript
// In Supabase client
const user = await supabase.auth.getUser();
console.log(user.user.user_metadata.full_name); // "John Doe"
console.log(user.user.user_metadata.role);      // "student"
```

## Integration Examples

### Node.js / Express

```javascript
const axios = require('axios');

async function createUser(email, password, fullName, role = 'student') {
  try {
    const response = await axios.post('https://www.website1wun.com/api/admin/users', {
      email,
      password,
      full_name: fullName,
      role
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    console.log('User created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
createUser('john@example.com', 'password123', 'John Doe', 'student');
```

### Python

```python
import requests

def create_user(email, password, full_name, role='student'):
    url = 'https://www.website1wun.com/api/admin/users'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {os.environ["SUPABASE_SERVICE_ROLE_KEY"]}'
    }

    data = {
        'email': email,
        'password': password,
        'full_name': full_name,
        'role': role
    }

    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()  # Raise exception for error status codes

    return response.json()

# Usage
user = create_user('john@example.com', 'password123', 'John Doe', 'student')
print(user)
```

### JavaScript (Fetch API)

```javascript
async function createUser(email, password, fullName, role = 'student') {
  const response = await fetch('https://www.website1wun.com/api/admin/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${YOUR_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
      role
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// Usage
try {
  const user = await createUser('john@example.com', 'password123', 'John Doe');
  console.log('User created:', user);
} catch (error) {
  console.error('Failed to create user:', error.message);
}
```

## Bulk User Creation

### With n8n Batch Processing

Use the **Loop** node to create multiple users:

1. Create an array of users to import
2. Use **Loop** node to iterate through the array
3. Each iteration calls the HTTP Request node with `{{ $json.item }}`
4. Monitor progress and errors

### With Python (Batch)

```python
import csv
import time

def create_users_from_csv(csv_file_path):
    results = []

    with open(csv_file_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                user = create_user(
                    email=row['email'],
                    password=row['password'],
                    full_name=row['full_name'],
                    role=row.get('role', 'student')
                )
                results.append({'status': 'success', 'user': user})
                print(f"✅ Created: {row['email']}")
            except Exception as e:
                results.append({'status': 'error', 'email': row['email'], 'error': str(e)})
                print(f"❌ Failed: {row['email']} - {e}")

            time.sleep(0.5)  # Rate limiting

    return results

# Usage: CSV with columns: email, password, full_name, role
results = create_users_from_csv('users.csv')
```

## Troubleshooting

### "Unauthorized: Admin access required"
- ✅ Check that your service role key is correct
- ✅ Verify the Authorization header format: `Bearer YOUR_KEY`
- ✅ Make sure the key hasn't been rotated

### "User with this email already exists"
- The email is already registered in your system
- Either delete the existing user first or use a different email

### "Invalid email format"
- The email address doesn't match standard email format
- Make sure it contains `@` and a domain extension like `.com`

### "Password must be at least 6 characters"
- Use a password with 6 or more characters
- Include mix of letters, numbers, and special characters for security

### "Invalid role"
- Use one of: `student`, `admin`, `instructor` (case-sensitive)
- Default is `student` if not specified

### User created but profile shows warning
- The auth user was created successfully (can log in)
- The profile will be created automatically by database trigger
- This is a known architectural limitation and the user can still use the system

## Security Best Practices

### 1. Protect Your Service Role Key
```bash
# ✅ Good: Store in environment variable
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx

# ❌ Bad: Hardcode in code
const key = "sb_secret_xxx";

# ❌ Bad: Commit to git
git commit "Added API key: sb_secret_xxx"
```

### 2. Use Secure Passwords
```javascript
// Generate secure passwords for bulk creation
function generatePassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
```

### 3. Validate Input
```javascript
function validateUserInput(email, password, fullName) {
  if (!email || !email.includes('@')) throw new Error('Invalid email');
  if (!password || password.length < 6) throw new Error('Password too short');
  if (!fullName || fullName.trim().length === 0) throw new Error('Invalid name');
  return true;
}
```

### 4. Log User Creation Events
```javascript
// Track who created which users
async function createUserWithAudit(email, password, fullName, createdBy) {
  const user = await createUser(email, password, fullName);

  // Log to your audit table
  await supabase.from('audit_logs').insert({
    action: 'user_created',
    user_id: user.id,
    email: email,
    created_by: createdBy,
    created_at: new Date().toISOString()
  });

  return user;
}
```

## Limits & Rate Limiting

- **Max batch size**: No hard limit, but recommended ≤ 100 per batch
- **Rate limit**: 60 requests per minute per IP (Supabase default)
- **Max password length**: 72 characters
- **Email uniqueness**: Globally unique across all users

## Support & Debugging

### Enable Debug Logging
```javascript
// In your API calls, log everything
console.log('Request:', { email, fullName, role });
console.log('Response:', response);
console.error('Error:', error);
```

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Select your project
3. Go to **Logs** → **API** or **Postgres**
4. Search for your request or error

### Common Issues Checklist
- [ ] Service role key is correct
- [ ] Using correct URL (includes `https://`)
- [ ] Headers include `Content-Type: application/json`
- [ ] JSON body is valid (use JSON validator)
- [ ] Email is unique (not already in system)
- [ ] Password is at least 6 characters
- [ ] Role is one of: student, admin, instructor

---

**Need help?** Check the full API documentation in `API_DOCUMENTATION.md` or contact support.

**Last Updated**: November 20, 2025
