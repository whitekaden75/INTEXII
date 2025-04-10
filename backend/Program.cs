using System.Data;
using System.Security.Claims;
using backend.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RootkitAuth.API.Data;
using RootkitAuth.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.CustomSchemaIds(type => type.FullName);
});

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("MovieConnection"),
                     ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("MovieConnection"))));

builder.Services.AddDbContext<MovieRecommendationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MovieRecommendationConnection")));

builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("UserConnection")));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("IdentityConnection"),
                     ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("IdentityConnection"))));

builder.Services.AddAuthorization();

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 12;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactAppBlah",
        policy => {
            policy.WithOrigins("http://localhost:4005",
                             "http://localhost:5173",
                             "http://127.0.0.1:4005",
                             "http://127.0.0.1:5173",
                             "https://purple-wave-0396f251e.6.azurestaticapps.net")
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }));

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor |
                       Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add security headers middleware with logging
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Processing request for {Path}", context.Request.Path);
    context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';");
    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("Referrer-Policy", "no-referrer");
    await next();
    logger.LogInformation("Security headers added to response for {Path}", context.Request.Path);
});

app.UseCors("AllowReactAppBlah");

app.UseAuthentication();
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Authentication middleware - User authenticated: {IsAuthenticated}, Identity: {Identity}",
        context.User.Identity?.IsAuthenticated ?? false,
        context.User.Identity?.Name ?? "None");
    await next();
});

app.UseAuthorization();
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Authorization middleware - Path: {Path}, Claims: {Claims}",
        context.Request.Path,
        context.User.Claims.Any() ? string.Join(", ", context.User.Claims.Select(c => $"{c.Type}={c.Value}")) : "None");
    await next();
});

app.MapControllers();
app.MapIdentityApi<IdentityUser>();

app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Logout endpoint called for user: {Identity}", context.User.Identity?.Name ?? "None");
    await signInManager.SignOutAsync();

    // More aggressively delete the cookie
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        Secure = true,
        HttpOnly = true,
        SameSite = SameSiteMode.None,
        Path = "/",
        Domain = null, // Use the same domain as the cookie
        Expires = DateTimeOffset.UtcNow.AddDays(-1) // Expired cookie
    });

    logger.LogInformation("Cookie '.AspNetCore.Identity.Application' deleted");
    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

app.MapGet("/pingauth", (ClaimsPrincipal user, ILogger<Program> logger) =>
{
    logger.LogInformation("Ping endpoint - User authenticated: {IsAuthenticated}, Identity: {Identity}",
        user.Identity?.IsAuthenticated ?? false,
        user.Identity?.Name ?? "None");
    logger.LogInformation("Pingauth claims: {Claims}",
        user.Claims.Any() ? string.Join(", ", user.Claims.Select(c => $"{c.Type}={c.Value}")) : "None");

    if (!user.Identity?.IsAuthenticated ?? false)
    {
        logger.LogWarning("Pingauth: User not authenticated, returning 401");
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    var roles = user.FindAll(ClaimTypes.Role).Select(claim => claim.Value).ToList();
    logger.LogInformation("Pingauth returning user data - Email: {Email}, Roles: {Roles}",
        email,
        string.Join(", ", roles));
    return Results.Json(new { email = email, roles = roles });
}).RequireAuthorization();

app.Run();