# GET /api/admin/users - List Users API

## Overview
New endpoint to list, filter, search, and paginate through your users. Perfect for n8n workflows that need to query user data.

## Endpoint
```
GET https://www.website1wun.com/api/admin/users
```

## Authentication
```
Authorization: Bearer {ADMIN_BEARER_TOKEN}
```

## Query Parameters

All parameters are optional:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 10 | Items per page (max 100) |
| offset | number | 0 | Number of items to skip |
| role | string | - | Filter by role: `admin`, `student`, `instructor` |
| is_active | boolean | - | Filter by active status: `true` or `false` |
| search | string | - | Search by email or full_name (case-insensitive, partial match) |
| sort_by | string | created_at | Sort field: `created_at`, `email`, `full_name` |
| sort_order | string | desc | Sort direction: `asc` or `desc` |

## Response Format

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "student",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}
```

## Usage Examples

### Example 1: Get first 10 users
```bash
curl -X GET "https://www.website1wun.com/api/admin/users?limit=10&offset=0" \
  -H "Authorization: Bearer {ADMIN_BEARER_TOKEN}"
```

### Example 2: Get all students
```bash
curl -X GET "https://www.website1wun.com/api/admin/users?role=student&limit=100" \
  -H "Authorization: Bearer {ADMIN_BEARER_TOKEN}"
```

### Example 3: Search for user by email
```bash
curl -X GET "https://www.website1wun.com/api/admin/users?search=john@example.com" \
  -H "Authorization: Bearer {ADMIN_BEARER_TOKEN}"
```

### Example 4: Get all active admins sorted by name
```bash
curl -X GET "https://www.website1wun.com/api/admin/users?role=admin&is_active=true&sort_by=full_name&sort_order=asc" \
  -H "Authorization: Bearer {ADMIN_BEARER_TOKEN}"
```

### Example 5: Paginate through all users (100 per page)
```bash
# Page 1
curl -X GET "https://www.website1wun.com/api/admin/users?limit=100&offset=0" \
  -H "Authorization: Bearer {ADMIN_BEARER_TOKEN}"

# Page 2
curl -X GET "https://www.website1wun.com/api/admin/users?limit=100&offset=100" \
  -H "Authorization: Bearer {ADMIN_BEARER_TOKEN}"
```

## n8n Integration Examples

### Use Case 1: Check if user exists before creating
```
HTTP Request Node:
Method: GET
URL: https://www.website1wun.com/api/admin/users?search={{$json.email}}&limit=1
Headers:
  - Authorization: Bearer {{$env.ADMIN_BEARER_TOKEN}}

In next node:
if (data.pagination.total === 0) {
  // User doesn't exist, safe to create
} else {
  // User exists
}
```

### Use Case 2: Get all student emails for bulk email send
```
HTTP Request Node:
Method: GET
URL: https://www.website1wun.com/api/admin/users?role=student&limit=100
Headers:
  - Authorization: Bearer {{$env.ADMIN_BEARER_TOKEN}}

Extract emails:
{{$json.data.map(u => u.email)}}
```

### Use Case 3: Find inactive users and reactivate them
```
HTTP Request Node 1 (List inactive):
Method: GET
URL: https://www.website1wun.com/api/admin/users?is_active=false&limit=100
Headers:
  - Authorization: Bearer {{$env.ADMIN_BEARER_TOKEN}}

Then loop through results and call PUT /api/admin/users/[id] with is_active=true
```

### Use Case 4: Pagination for large user imports
```
Use in While loop:
- Initial offset = 0, limit = 100
- Keep incrementing offset by limit until has_more = false

{{$json.pagination.has_more ? 'true' : 'false'}}

Next offset = {{$json.pagination.offset + $json.pagination.limit}}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```
Missing or invalid Authorization header.

### 400 Bad Request
```json
{
  "error": "Invalid query parameters",
  "details": {
    "params": "limit must be a positive number (max 100)"
  }
}
```
Invalid query parameters. Check parameter values and formats.

### 500 Server Error
```json
{
  "error": "Failed to fetch users"
}
```
Server error. Try again later.

## Common Queries

```
# Get all users, sorted newest first
?sort_by=created_at&sort_order=desc&limit=100

# Find users with 'admin' in their name
?search=admin&limit=50

# Get inactive students
?role=student&is_active=false&limit=100

# Get all admins sorted alphabetically
?role=admin&sort_by=full_name&sort_order=asc&limit=100

# Search for users created today (combine with your workflow date logic)
?sort_by=created_at&sort_order=desc&limit=1000
```

## Performance Tips

1. **Use limit and offset** for large result sets instead of fetching all at once
2. **Filter early** - use role/is_active filters to reduce results before paginating
3. **Search specifically** - partial match search is case-insensitive, so be specific with search terms
4. **Cache results** - if you're repeatedly querying the same filters, consider caching in n8n

## Related Endpoints

- **POST /api/admin/users** - Create new user
- **GET /api/admin/users/[userId]** - Get specific user details
- **PUT /api/admin/users/[userId]** - Update user
- **DELETE /api/admin/users/[userId]** - Delete user
