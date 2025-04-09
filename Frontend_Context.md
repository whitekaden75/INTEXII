# Frontend Authentication Context

---

## Backend Capabilities

- **JWT + Refresh Tokens** with rotation
- Refresh tokens stored in **HttpOnly, Secure cookies**
- **CSRF protection** via `X-CSRF-TOKEN` header on refresh requests
- **Email verification** required before login
- **Multi-Factor Authentication (MFA)** support enabled
- **Role-based authorization** enforced on sensitive endpoints
- **Logout** revokes refresh token and clears cookie
- Endpoints:
  - `/login` (POST)
  - `/register` (POST)
  - `/refresh-token` (POST, requires CSRF header)
  - `/logout` (POST)
  - `/confirm-email` (GET)
  - `/enable-mfa` (POST)
  - `/pingauth` (GET, optional for auth status)
  - Role management endpoints (admin only)

---

## Frontend Responsibilities

- Store JWT access token in memory or localStorage
- Attach JWT as `Authorization: Bearer <token>` header on API requests
- Handle token expiration by calling `/refresh-token`
- Send `X-CSRF-TOKEN` header with refresh requests
- Use refresh token cookie (no direct access)
- Support email verification flow
- Support MFA flow
- Call `/logout` to clear session
- Show/hide UI based on user roles and auth status
- Handle errors and token refresh failures gracefully

---

## Security Considerations

- Never store refresh tokens in JavaScript-accessible storage
- Always send CSRF header with refresh requests
- Use HTTPS for all requests
- Handle 401/403 errors by redirecting to login
- Prompt user to verify email if not confirmed
- Prompt for MFA code if required

---

## Testing Checklist

- Login, registration, logout
- Email confirmation flow
- MFA enablement and verification
- Token expiration and refresh
- CSRF protection
- Role-based access control
- Error handling and edge cases

---

This context will help guide the frontend implementation to integrate seamlessly with the secure backend authentication system.