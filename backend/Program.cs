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
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Ensure email is stored in claims

    // Enforce strong password policies
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true; // special character
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequiredUniqueChars = 1;
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();


builder.Services.AddCors (options => 
    options.AddPolicy("AllowReactAppBlah",
        policy => {
            policy.WithOrigins("http://localhost:4005", // Your frontend port
                             "http://localhost:5173",   // Alternative Vite default port
                             "http://127.0.0.1:4005",  // Also allow localhost as IP
                            "http://127.0.0.1:5173",
                            "https://nice-ground-00910891e.6.azurestaticapps.net")
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }));


//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseCors("AllowReactAppBlah");

//app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();

//app.Run();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None; // change after adding https for production
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

// Add security headers middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';");
    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("Referrer-Policy", "no-referrer");
    await next();
});

// Add security headers middleware
app.UseCors("AllowReactAppBlah");

app.UseAuthentication(); // Ensure this is before UseAuthorization
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<IdentityUser>();

app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();

    // Ensure authentication cookie is removed
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application");

    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();


app.MapGet("/pingauth", (ClaimsPrincipal user, ILogger<Program> logger) =>
{
    logger.LogInformation("User identity is: {Identity}", user.Identity?.Name);

    if (!user.Identity?.IsAuthenticated ?? false)
    {
        Console.WriteLine("User is not authenticated.");
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    // Extract roles from the user claims
    var roles = user.FindAll(ClaimTypes.Role)
                    .Select(claim => claim.Value)
                    .ToList();

    return Results.Json(new { email = email, roles = roles });
}).RequireAuthorization();


app.Run();
