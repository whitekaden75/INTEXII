# Authentication & Authorization System Overview

---

## Backend (ASP.NET Core)

### Authentication

- **Type:** Cookie-based (persistent/session)
- **Framework:** ASP.NET Core Identity
- **Storage:** SQLite (`ApplicationDbContext`)
- **Endpoints:**
  - `POST /login` — Validates credentials, sets auth cookie
  - `POST /register` — Creates user, sets auth cookie
  - `POST /logout` — Signs out, clears cookie
  - `GET /pingauth` — Returns `{ authenticated, email }`
- **Middleware:**
  - Configured for cookie auth, CORS with credentials
  - Custom claims via `CustomUserClaimsPrincipalFactory`
- **No JWT tokens used**

### Authorization

- **Role Management:**
  - `RoleController` (protected by `[Authorize(Roles = "Administrator")]`)
    - `POST /Role/AddRole?roleName=...`
    - `POST /Role/AssignRoleToUser?userEmail=...&roleName=...`
  - Roles stored in Identity DB
- **Role Enforcement:**
  - **Only** on `RoleController`
  - No other `[Authorize]` attributes found
- **User Data:**
  - `UserRecommendationsController` unrelated to auth

---

## Frontend (React + TypeScript)

### Login Flow

- Submits credentials to `/login`
- Backend sets auth cookie
- Navigates to `/movies`
- No token storage

### Auth Status Check

- Calls `/pingauth`
- Updates auth state accordingly
- Conditionally renders protected content

### Logout Flow

- **Current:**
  - Clears local React state
  - Redirects to `/`
  - **Does NOT call backend `/logout`**
  - Leaves backend session cookie valid
- **Recommendation:**
  - Call backend `/logout` endpoint to invalidate session
  - Then clear frontend state and redirect

---

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB

    User->>Frontend: Enter email/password
    Frontend->>Backend: POST /login (with credentials)
    Backend->>DB: Find user by email
    DB-->>Backend: User data
    Backend->>Backend: Validate password
    alt Success
        Backend-->>Frontend: 200 OK, sets auth cookie
        Frontend->>User: Navigate to /movies
    else Failure
        Backend-->>Frontend: 400 Error
        Frontend->>User: Show error
    end

    Frontend->>Backend: GET /pingauth (with cookie)
    Backend->>Backend: Check cookie/session
    alt Authenticated
        Backend-->>Frontend: { authenticated: true, email }
    else Not Authenticated
        Backend-->>Frontend: { authenticated: false }
    end

    User->>Frontend: Click logout
    Frontend->>Backend: POST /logout (with cookie)
    Backend->>Backend: Sign out, clear cookie
    Backend-->>Frontend: 200 OK
    Frontend->>User: Redirect to login
```

---

## Role Management Diagram

```mermaid
sequenceDiagram
    participant AdminUser
    participant Frontend
    participant Backend
    participant DB

    AdminUser->>Frontend: Create role "Moderator"
    Frontend->>Backend: POST /Role/AddRole?roleName=Moderator (admin cookie)
    Backend->>DB: Check/create role
    Backend-->>Frontend: Success/error

    AdminUser->>Frontend: Assign "Moderator" to user@example.com
    Frontend->>Backend: POST /Role/AssignRoleToUser?userEmail=user@example.com&roleName=Moderator
    Backend->>DB: Check user/role, assign
    Backend-->>Frontend: Success/error
```

---

## Edge Cases Considered

- Invalid credentials
- User not found
- Expired/invalid cookie
- Cross-origin requests
- Role assignment errors
- Registration errors
- Frontend refresh restoring auth state
- Logout not invalidating backend session (recommendation to fix)

---

# Summary

- **Backend:** Cookie-based auth, role management protected by "Administrator" role
- **Frontend:** Relies on cookies, no explicit token handling
- **Logout:** Needs improvement to call backend `/logout`
- **Authorization:** Minimal, mostly on role management
- **Security:** Consider adding more `[Authorize]` attributes and explicit logout call