# Frontend Authentication Implementation Plan

---

## 1. JWT Token Handling

- Store JWT access token in **memory** or **localStorage**
- Attach JWT as `Authorization: Bearer <token>` header on all API requests
- Remove JWT from storage on logout

---

## 2. Refresh Token Management

- Refresh token is stored in **HttpOnly, Secure cookie** (set by backend)
- Frontend **does not access refresh token directly**
- When access token expires:
  - Call `/refresh-token` endpoint
  - Include `X-CSRF-TOKEN` header with a random or session-specific value
  - Backend will rotate refresh token and return new JWT
- Update stored JWT with new token

---

## 3. CSRF Protection

- Generate a CSRF token on app load or login
- Store CSRF token in memory or localStorage
- Send `X-CSRF-TOKEN` header with **all refresh token requests**
- Backend will reject requests without this header

---

## 4. Login Flow

- POST email and password to `/login`
- On success:
  - Store JWT
  - Refresh token cookie is set automatically
- Redirect user to protected area

---

## 5. Registration Flow

- POST email and password to `/register`
- On success:
  - Store JWT
  - Refresh token cookie is set automatically
  - Display message: **"Please confirm your email"**
- User must click email confirmation link before login works

---

## 6. Email Confirmation

- User receives email with confirmation link
- Frontend should handle `/confirm-email?userId=...&token=...`
- Call backend `/confirm-email` endpoint with these params
- Display success or error message

---

## 7. Multi-Factor Authentication (MFA)

- Provide UI to **enable MFA** (calls `/enable-mfa`)
- On login, if MFA is enabled:
  - Prompt user for MFA code
  - Verify MFA code with backend (future work)
- Block access until MFA is verified

---

## 8. Logout Flow

- Call `/logout` endpoint
- Clear stored JWT
- Refresh token cookie will be cleared by backend
- Redirect to login page

---

## 9. Authorization Handling

- Use JWT claims or backend `/pingauth` to determine user roles
- Show/hide UI elements based on roles
- Redirect unauthorized users away from protected pages

---

## 10. Error Handling

- Handle 401/403 errors by redirecting to login
- Display error messages for failed login, registration, or token refresh
- Retry refresh token flow on access token expiration

---

## 11. Testing

- Test login, registration, email confirmation, MFA, logout
- Test token expiration and refresh
- Test CSRF protection
- Test role-based access control

---

This plan will ensure the frontend fully integrates with the secure backend authentication system.