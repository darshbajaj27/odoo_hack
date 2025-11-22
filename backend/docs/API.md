# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints (except login/signup) require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### Products

#### GET /products
List all products with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search by name, SKU, or description

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### GET /products/:id
Get product details.

#### POST /products
Create a new product.

**Request:**
```json
{
  "name": "Laptop",
  "sku": "PROD-001",
  "description": "High-performance laptop",
  "category": "Electronics",
  "price": 1299.99,
  "quantity": 50,
  "reorderLevel": 10
}
```

#### PUT /products/:id
Update product.

#### DELETE /products/:id
Delete product.

### Operations

#### GET /operations
List operations with pagination and filters.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): PENDING, COMPLETED, CANCELLED
- `type` (optional): INBOUND, OUTBOUND, TRANSFER, ADJUSTMENT

#### POST /operations
Create operation.

**Request:**
```json
{
  "productId": "product-id",
  "quantity": 50,
  "type": "INBOUND",
  "toLocationId": "location-id",
  "notes": "Stock received from supplier"
}
```

#### PATCH /operations/:id/status
Update operation status.

**Request:**
```json
{
  "status": "COMPLETED"
}
```

### Dashboard

#### GET /dashboard/stats
Get dashboard statistics.

#### GET /dashboard/charts
Get chart data.

#### GET /dashboard/recent-activity
Get recent operations.

### Search

#### GET /search?q=query
Global search across products and operations.

**Query Parameters:**
- `q` (required): Search query
- `type` (optional): all, products, operations
- `limit` (optional): Max results (default: 20)

### Settings

#### GET /settings/warehouses
List warehouses.

#### POST /settings/warehouses
Create warehouse (admin only).

#### GET /settings/locations
List locations.

#### POST /settings/locations
Create location (admin only).

#### GET /settings/users
List users (admin only).

#### PUT /settings/users/:id
Update user role (admin only).

#### GET /settings/contacts
List contacts.

#### POST /settings/contacts
Create contact.

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": [...] // Optional validation details
}
```

### Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

Not currently implemented but should be added for production.

## Versioning

Current API version: v1
