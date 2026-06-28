# Authentication API Documentation

This document describes the authentication endpoints available in the backend for user registration, login, token refresh, profile retrieval, and logout.

Base URL:
- http://localhost:3400/api/auth:<PORT>

## 1. Register User
Endpoint:
- POST /register

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Success response:
- Status: 201 Created
```json
{
  "message": "New User is created",
  "newUser": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "..."
}
```

Notes:
- A refresh token is also set in an HTTP-only cookie.

## 2. Login User
Endpoint:
- POST /login

Request body:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Success response:
- Status: 200 OK
```json
{
  "message": "Login Successfully",
  "accessToken": "...",
  "isUserExists": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Notes:
- A refresh token is stored in an HTTP-only cookie.

## 3. Get Current User
Endpoint:
- GET /get-me

Headers:
```http
Authorization: Bearer <accessToken>
```

Success response:
- Status: 200 OK
```json
{
  "message": "User Data get",
  "userData": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## 4. Logout User
Endpoint:
- GET /logout

Headers:
```http
Authorization: Bearer <accessToken>
```

Cookies:
- refreshToken

Success response:
- Status: 200 OK
```json
{
  "message": "Logout Successfully"
}
```

Notes:
- The refresh token cookie is cleared and the session is revoked.

## 5. Refresh Access Token
Endpoint:
- GET /refresh-token

Cookies:
- refreshToken

Success response:
- Status: 201 Created
```json
{
  "message": "New Access Token is generated",
  "accessToken": "..."
}
```

Notes:
- This endpoint issues a new access token using the refresh token stored in the cookie.

## Error Responses
Common error responses include:
- 400 Bad Request: missing fields or invalid input
- 404 Not Found: user not found, invalid password, or expired session
- 500 Internal Server Error: unexpected server issue
