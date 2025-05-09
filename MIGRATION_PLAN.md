# Fixing Swagger Schema ID Conflict in ASP.NET Core Identity + Custom AuthController

## Root Cause

- Duplicate class names `RegisterRequest` and `LoginRequest`:
  - Nested inside your `AuthController`
  - And in `Microsoft.AspNetCore.Identity.Data` (used by `MapIdentityApi`)
- Swagger generates schema IDs based on class names by default, causing a conflict.

---

## Solution Plan

### 1. Rename Nested Request Classes

| Old Name          | New Name               |
|-------------------|------------------------|
| `LoginRequest`    | `AuthLoginRequest`     |
| `RegisterRequest` | `AuthRegisterRequest`  |

Update the controller method signatures accordingly.

---

### 2. Configure Swagger to Use Fully Qualified Schema IDs

Modify Swagger configuration in `Program.cs`:

```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.CustomSchemaIds(type => type.FullName);
});
```

This ensures future-proofing against similar naming conflicts.

---

## Implementation Details

### AuthController.cs

- Rename nested classes:

```csharp
public class AuthLoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthRegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

- Update method parameters:

```csharp
public async Task<IActionResult> Login([FromBody] AuthLoginRequest model)
public async Task<IActionResult> Register([FromBody] AuthRegisterRequest model)
```

---

### Program.cs

Replace:

```csharp
builder.Services.AddSwaggerGen();
```

With:

```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.CustomSchemaIds(type => type.FullName);
});
```

---

## Visual Overview

```mermaid
classDiagram
    class AuthController {
        +Login(AuthLoginRequest model)
        +Register(AuthRegisterRequest model)
    }

    class AuthLoginRequest {
        string Email
        string Password
    }

    class AuthRegisterRequest {
        string Email
        string Password
    }

    class Microsoft.AspNetCore.Identity.Data.RegisterRequest
    class Microsoft.AspNetCore.Identity.Data.LoginRequest

    AuthController --> AuthLoginRequest
    AuthController --> AuthRegisterRequest
    MapIdentityApi --> Microsoft.AspNetCore.Identity.Data.RegisterRequest
    MapIdentityApi --> Microsoft.AspNetCore.Identity.Data.LoginRequest
```

---

## Summary

- Rename nested request classes to `AuthLoginRequest` and `AuthRegisterRequest`.
- Update controller method parameters.
- Configure Swagger to use fully qualified type names for schema IDs.
- This will resolve the conflict and prevent future schema ID collisions.

---

# Updating Deployed Identity Database on RDS MySQL

## Typical Workflow for Schema Updates

1. **Make changes** to your Identity models or `ApplicationDbContext`.
2. **Generate a new migration**:

```bash
dotnet ef migrations add YourMigrationName --context ApplicationDbContext
```

3. **Review** the generated migration code.
4. **Apply the migration to your deployed RDS database**:

```bash
dotnet ef database update --context ApplicationDbContext
```

This updates the schema **in place** without data loss (assuming proper migration design).

---

## For Data Updates

- Use SQL scripts or admin tools (MySQL Workbench, DBeaver, etc.) to insert, update, or delete identity data.
- Always **backup** your RDS database before major updates.

---

## Best Practices

- **Version control** your migrations.
- **Test migrations locally** before applying to production.
- Use **transactional migrations** to avoid partial updates.
- Automate schema updates as part of your CI/CD pipeline if possible.