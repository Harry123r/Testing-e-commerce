# API Reference Documentation

This document provides comprehensive information about all API endpoints, request/response formats, and usage examples for the Django REST Framework E-commerce API.

## Base URL
```
http://localhost:8000/api/
```

## Authentication

The API uses session-based authentication for admin operations and supports both public and protected endpoints.

### Authentication Headers
For protected endpoints, include the session cookie or authentication token in your requests.

## API Endpoints

### 1. Authentication Endpoints

#### User Registration
- **URL**: `POST /register/`
- **Description**: Register a new user account
- **Access**: Public
- **Request Body**:
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password123"
}
```
- **Response** (201 Created):
```json
{
    "message": "User created Successfully"
}
```
- **Response** (400 Bad Request):
```json
{
    "username": ["This field is required."],
    "email": ["Enter a valid email address."],
    "password": ["This field is required."]
}
```

#### User Login
- **URL**: `POST /login/`
- **Description**: Authenticate user and create session
- **Access**: Public
- **Request Body**:
```json
{
    "email": "john@example.com",
    "password": "secure_password123"
}
```
- **Response** (200 OK):
```json
{
    "message": "Logged in Successfully",
    "username": "john_doe"
}
```
- **Response** (401 Unauthorized):
```json
{
    "message": "Invalid credentials"
}
```

#### Admin Login
- **URL**: `POST /admin-login/`
- **Description**: Authenticate admin user
- **Access**: Public
- **Request Body**:
```json
{
    "email": "admin@example.com",
    "password": "admin_password123"
}
```
- **Response** (200 OK):
```json
{
    "message": "Admin login successful",
    "is_admin": true
}
```
- **Response** (403 Forbidden):
```json
{
    "detail": "Not an admin user"
}
```

#### Admin Registration
- **URL**: `POST /admin-register/`
- **Description**: Register a new admin user
- **Access**: Public
- **Request Body**:
```json
{
    "username": "admin_user",
    "email": "admin@example.com",
    "password": "admin_password123"
}
```
- **Response** (201 Created):
```json
{
    "message": "Admin registered successfully",
    "is_admin": true,
    "username": "admin_user"
}
```

### 2. Product Endpoints

#### List/Create Products
- **URL**: `GET/POST /products/`
- **Description**: List all products or create a new product
- **Access**: GET (Public), POST (Admin only)
- **Query Parameters**:
  - `search`: Search in name and description
  - `ordering`: Order by name, price, or stock
  - `limit`: Number of items per page
  - `offset`: Number of items to skip
  - `name__iexact`: Exact name match (case-insensitive)
  - `name__icontains`: Partial name match (case-insensitive)
  - `price__exact`: Exact price match
  - `price__lt`: Price less than
  - `price__gt`: Price greater than
  - `price__range`: Price range (min,max)
  - `stock__gt`: In stock filter (stock > 0)

**GET Request Example**:
```bash
GET /api/products/?search=laptop&ordering=price&limit=10&offset=0
```

**Response** (200 OK):
```json
{
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "MacBook Pro",
            "description": "High-performance laptop",
            "price": "1299.99",
            "stock": 10,
            "image": "/media/products/laptop.jpg",
            "image_url": "/media/products/laptop.jpg"
        }
    ]
}
```

**POST Request Example** (Admin only):
```json
{
    "name": "New Product",
    "description": "Product description",
    "price": "99.99",
    "stock": 50,
    "image": null
}
```

#### Product Detail
- **URL**: `GET/PUT/DELETE /products/{id}/`
- **Description**: Retrieve, update, or delete a specific product
- **Access**: GET (Public), PUT/DELETE (Admin only)
- **URL Parameters**:
  - `id`: Product ID (integer)

**GET Request Example**:
```bash
GET /api/products/1/
```

**Response** (200 OK):
```json
{
    "id": 1,
    "name": "MacBook Pro",
    "description": "High-performance laptop",
    "price": "1299.99",
    "stock": 10,
    "image": "/media/products/laptop.jpg",
    "image_url": "/media/products/laptop.jpg"
}
```

**PUT Request Example** (Admin only):
```json
{
    "name": "Updated Product Name",
    "description": "Updated description",
    "price": "89.99",
    "stock": 25,
    "image": null
}
```

#### Product Information
- **URL**: `GET /products/info`
- **Description**: Get aggregated product statistics
- **Access**: Public
- **Response** (200 OK):
```json
{
    "products": [
        {
            "id": 1,
            "name": "MacBook Pro",
            "description": "High-performance laptop",
            "price": "1299.99",
            "stock": 10,
            "image": "/media/products/laptop.jpg",
            "image_url": "/media/products/laptop.jpg"
        }
    ],
    "count": 5,
    "max_price": 1299.99
}
```

### 3. Order Endpoints

#### Order Management
- **URL**: `GET/POST/PUT/DELETE /order/`
- **Description**: Manage orders (ViewSet with all CRUD operations)
- **Access**: Authenticated users (own orders), Admin (all orders)
- **Query Parameters**:
  - `status`: Filter by order status
  - `created_at`: Filter by creation date
  - `created_at__lt`: Created before date
  - `created_at__gt`: Created after date

**GET Request Example**:
```bash
GET /api/order/?status=Pending
```

**Response** (200 OK):
```json
[
    {
        "order_id": "550e8400-e29b-41d4-a716-446655440000",
        "created_at": "2024-01-15T10:30:00Z",
        "user": 1,
        "status": "Pending",
        "items": [
            {
                "product_name": "MacBook Pro",
                "product_price": "1299.99",
                "quantity": 1,
                "item_subtotal": 1299.99
            }
        ],
        "total_price": 1299.99
    }
]
```

**POST Request Example** (Create new order):
```json
{
    "status": "Pending",
    "items": [
        {
            "product": 1,
            "quantity": 2
        },
        {
            "product": 2,
            "quantity": 1
        }
    ]
}
```

**Response** (201 Created):
```json
{
    "order_id": "550e8400-e29b-41d4-a716-446655440001",
    "created_at": "2024-01-15T10:35:00Z",
    "user": 1,
    "status": "Pending",
    "items": [
        {
            "product_name": "MacBook Pro",
            "product_price": "1299.99",
            "quantity": 2,
            "item_subtotal": 2599.98
        },
        {
            "product_name": "iPhone",
            "product_price": "999.99",
            "quantity": 1,
            "item_subtotal": 999.99
        }
    ],
    "total_price": 3599.97
}
```

#### Individual Order Operations
- **URL**: `GET/PUT/DELETE /order/{order_id}/`
- **Description**: Retrieve, update, or delete a specific order
- **Access**: Order owner or Admin
- **URL Parameters**:
  - `order_id`: Order UUID

**PUT Request Example** (Update order status):
```json
{
    "status": "Confirmed"
}
```

## Data Models

### Product Model
```python
{
    "id": "integer",
    "name": "string (max 200 chars)",
    "description": "text",
    "price": "decimal (max 10 digits, 2 decimal places)",
    "stock": "positive integer",
    "image": "image file (optional)",
    "image_url": "computed field"
}
```

### Order Model
```python
{
    "order_id": "UUID (auto-generated)",
    "user": "user ID (foreign key)",
    "created_at": "datetime (auto-generated)",
    "status": "string (Pending/Confirmed/Cancelled)",
    "items": "array of order items",
    "total_price": "computed field"
}
```

### OrderItem Model
```python
{
    "product": "product ID (foreign key)",
    "quantity": "positive integer",
    "item_subtotal": "computed field (price * quantity)"
}
```

### User Model
```python
{
    "id": "integer",
    "username": "string (unique)",
    "email": "email (unique)",
    "password": "string (write-only)",
    "is_staff": "boolean",
    "is_superuser": "boolean"
}
```

## Error Handling

### Common HTTP Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
    "field_name": ["Error message"],
    "non_field_errors": ["General error message"]
}
```

## Pagination

The API uses limit-offset pagination for product listings:

- **limit**: Number of items per page (default: 10)
- **offset**: Number of items to skip
- **count**: Total number of items
- **next**: URL for next page (null if no next page)
- **previous**: URL for previous page (null if no previous page)

## Filtering and Search

### Product Filtering
- **Text Search**: Search in product name and description
- **Price Filtering**: Exact, less than, greater than, range
- **Stock Filtering**: In-stock products only
- **Name Filtering**: Exact or partial name matching

### Order Filtering
- **Status Filtering**: Filter by order status
- **Date Filtering**: Filter by creation date

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:5173` (React dev server)
- `http://127.0.0.1:5173`

## Security Considerations

1. **Authentication**: Session-based authentication for admin operations
2. **Permissions**: Role-based access control
3. **Input Validation**: Comprehensive serializer validation
4. **CSRF Protection**: Enabled for all POST requests
5. **File Uploads**: Image files only, with proper validation

## Testing the API

### Using curl
```bash
# Get all products
curl -X GET http://localhost:8000/api/products/

# Create a product (requires admin authentication)
curl -X POST http://localhost:8000/api/products/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","description":"Test","price":"99.99","stock":10}'

# Get product details
curl -X GET http://localhost:8000/api/products/1/
```

### Using Postman
1. Import the API endpoints
2. Set base URL to `http://localhost:8000/api/`
3. Include authentication headers for protected endpoints
4. Test all CRUD operations

### Using the Frontend
The React frontend provides a user-friendly interface for testing all API endpoints.
