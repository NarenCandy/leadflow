# GigFlow API Documentation

**Base URL (Local):** `http://localhost:5000/api`  
**Base URL (Production):** `https://leadflow-backend-oh0z.onrender.com/api`

All protected routes require the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

All responses follow this format:
```json
{
  "success": true,
  "message": "Description",
  "data": {}
}
```

---

## Authentication

### Register
```
POST /auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "sales"
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "sales" },
    "token": "eyJ..."
  }
}
```

---

### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "sales" },
    "token": "eyJ..."
  }
}
```

---

### Get Current User
```
GET /auth/me
```
**Auth required:** Yes  
**Response (200):**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "sales" }
  }
}
```

---

## Leads

### Get All Leads
```
GET /leads
```
**Auth required:** Yes  
**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 10) |
| `status` | string | Filter by: New, Contacted, Qualified, Lost |
| `source` | string | Filter by: Website, Instagram, Referral |
| `search` | string | Search by name or email |
| `sort` | string | `latest` or `oldest` |

**Response (200):**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": {
    "leads": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 47,
      "pages": 5
    }
  }
}
```

---

### Get Single Lead
```
GET /leads/:id
```
**Auth required:** Yes  
**Response (200):**
```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": {
    "lead": {
      "_id": "...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "New",
      "source": "Instagram",
      "notes": "Interested in premium plan",
      "createdBy": { "_id": "...", "name": "Admin", "email": "admin@example.com" },
      "createdAt": "2026-05-17T...",
      "updatedAt": "2026-05-17T..."
    }
  }
}
```

---

### Create Lead
```
POST /leads
```
**Auth required:** Yes  
**Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Optional notes here"
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { "lead": { ... } }
}
```

---

### Update Lead
```
PUT /leads/:id
```
**Auth required:** Yes  
**Body (all fields optional):**
```json
{
  "name": "Updated Name",
  "status": "Qualified"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": { "lead": { ... } }
}
```

---

### Delete Lead
```
DELETE /leads/:id
```
**Auth required:** Yes — Admin only  
**Response (200):**
```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": null
}
```

---

### Export Leads as CSV
```
GET /leads/export/csv
```
**Auth required:** Yes  
**Query Parameters:** Same as Get All Leads (except page/limit)  
**Response:** CSV file download

---

## Users (Admin Only)

### Get All Users
```
GET /users
```
**Auth required:** Yes — Admin only  
**Response (200):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": { "users": [...] }
}
```

---

### Get Single User
```
GET /users/:id
```
**Auth required:** Yes — Admin only

---

### Update User Role
```
PATCH /users/:id/role
```
**Auth required:** Yes — Admin only  
**Body:**
```json
{
  "role": "admin"
}
```

---

### Delete User
```
DELETE /users/:id
```
**Auth required:** Yes — Admin only

---

## Error Responses

| Status Code | Meaning |
|---|---|
| 400 | Bad Request — validation failed or invalid input |
| 401 | Unauthorized — no token or invalid token |
| 403 | Forbidden — insufficient permissions |
| 404 | Not Found — resource doesn't exist |
| 500 | Server Error — something went wrong |

**Error response format:**
```json
{
  "success": false,
  "message": "Descriptive error message here"
}
```