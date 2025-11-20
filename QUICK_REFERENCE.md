# User Creation API - Quick Reference

## One-Liner Test

```bash
curl -X POST "https://www.website1wun.com/api/admin/users" -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" -d '{"email":"test@example.com","password":"password123","full_name":"Test User","role":"student"}'
```

## Endpoint

```
POST https://www.website1wun.com/api/admin/users
```

## Headers

```
Content-Type: application/json
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

## Request Body

```json
{
  "email": "required@example.com",
  "password": "required_min_6_chars",
  "full_name": "required",
  "role": "optional_default_student"
}
```

## Response (201)

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "full_name": "Full Name",
  "role": "student",
  "is_active": true,
  "created_at": "2025-11-20T..."
}
```

## Valid Roles
- `student` (default)
- `admin`
- `instructor`

## Common Errors

| Code | Error | Fix |
|------|-------|-----|
| 400 | Missing fields | Provide all: email, password, full_name |
| 400 | Invalid email | Use format: user@example.com |
| 400 | Password too short | Use 6+ characters |
| 400 | Invalid role | Use: student, admin, or instructor |
| 403 | Unauthorized | Check service role key is correct |
| 409 | User exists | Use different email |

## n8n Template

```json
{
  "method": "POST",
  "url": "https://www.website1wun.com/api/admin/users",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"
  },
  "body": {
    "email": "{{ $json.email }}",
    "password": "{{ $json.password }}",
    "full_name": "{{ $json.full_name }}",
    "role": "student"
  }
}
```

## Node.js

```javascript
const response = await fetch('https://www.website1wun.com/api/admin/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    full_name: 'John Doe',
    role: 'student'
  })
});
const user = await response.json();
```

## Python

```python
import requests

response = requests.post('https://www.website1wun.com/api/admin/users', json={
  'email': 'user@example.com',
  'password': 'password123',
  'full_name': 'John Doe',
  'role': 'student'
}, headers={
  'Authorization': f'Bearer {os.environ["SUPABASE_SERVICE_ROLE_KEY"]}'
})
user = response.json()
```

## Postman

1. **Method**: POST
2. **URL**: https://www.website1wun.com/api/admin/users
3. **Headers Tab**:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_SERVICE_ROLE_KEY`
4. **Body** (raw JSON):
   ```json
   {
     "email": "user@example.com",
     "password": "password123",
     "full_name": "John Doe",
     "role": "student"
   }
   ```

## Rate Limits
- 60 requests per minute per IP

## Documentation
- **Full Reference**: See `API_DOCUMENTATION.md`
- **How-To Guide**: See `USER_CREATION_GUIDE.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`

---
**Version**: 1.0
**Last Updated**: November 20, 2025
