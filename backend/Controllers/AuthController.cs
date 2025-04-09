namespace RootkitAuth.API.Controllers;


using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RootkitAuth.API.Services;
using RootkitAuth.API.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly JwtTokenService _jwtTokenService;
    private readonly ApplicationDbContext _dbContext;

    public AuthController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, JwtTokenService jwtTokenService, ApplicationDbContext dbContext)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _dbContext = dbContext;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthLoginRequest model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return BadRequest(new { message = "User not found." });
        }

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, isPersistent: true, lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Invalid password." });
        }
var roles = await _userManager.GetRolesAsync(user);
if (user.Email == null)
    throw new InvalidOperationException("User email is null.");
var token = _jwtTokenService.GenerateToken(user.Id, user.Email, roles);

var refreshToken = new RefreshToken
{
    Token = Guid.NewGuid().ToString(),
    UserId = user.Id,
    Expires = DateTime.UtcNow.AddDays(7),
    IsRevoked = false
};

_dbContext.RefreshTokens.Add(refreshToken);
await _dbContext.SaveChangesAsync();

Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
{
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Strict,
    Expires = refreshToken.Expires
});

return Ok(new { token });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CustomRegisterRequest model)
    {
        var user = new IdentityUser { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _signInManager.SignInAsync(user, isPersistent: true);
        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtTokenService.GenerateToken(user.Id, user.Email, roles);
        
        var refreshToken = new RefreshToken
        {
            Token = Guid.NewGuid().ToString(),
            UserId = user.Id,
            Expires = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };
        
        _dbContext.RefreshTokens.Add(refreshToken);
        await _dbContext.SaveChangesAsync();
        
        Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = refreshToken.Expires
        });
        
        var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var confirmationUrl = $"https://yourfrontend.com/confirm-email?userId={user.Id}&token={Uri.EscapeDataString(emailToken)}";
        
        // TODO: Send confirmationUrl via email
        Console.WriteLine($"Email confirmation link: {confirmationUrl}");
        
        return Ok(new { token, message = "Please confirm your email. Confirmation link logged for testing." });
    }
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        if (!Request.Headers.TryGetValue("X-CSRF-TOKEN", out var csrfToken) || string.IsNullOrEmpty(csrfToken))
        {
            return Unauthorized(new { message = "Missing or invalid CSRF token." });
        }
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized(new { message = "Refresh token cookie missing." });
        }

        var existingToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken && !rt.IsRevoked && rt.Expires > DateTime.UtcNow);

        if (existingToken == null)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token." });
        }

        var user = await _userManager.FindByIdAsync(existingToken.UserId);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        var roles = await _userManager.GetRolesAsync(user);
        if (user.Email == null)
            throw new InvalidOperationException("User email is null.");
        var newJwt = _jwtTokenService.GenerateToken(user.Id, user.Email, roles);

        // Revoke old refresh token
        existingToken.IsRevoked = true;

        // Create new refresh token
        var newRefreshToken = new RefreshToken
        {
            Token = Guid.NewGuid().ToString(),
            UserId = user.Id,
            Expires = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };

        _dbContext.RefreshTokens.Add(newRefreshToken);
        await _dbContext.SaveChangesAsync();

        Response.Cookies.Append("refreshToken", newRefreshToken.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = newRefreshToken.Expires
        });
        
        return Ok(new { token = newJwt });
    }
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        if (!string.IsNullOrEmpty(refreshToken))
        {
            var token = await _dbContext.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken && !rt.IsRevoked);

            if (token != null)
            {
                token.IsRevoked = true;
                await _dbContext.SaveChangesAsync();
            }
        }

        Response.Cookies.Delete("refreshToken");

        return Ok(new { message = "Logged out successfully." });
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return BadRequest(new { message = "Invalid user ID." });
        }

        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (result.Succeeded)
        {
            return Ok(new { message = "Email confirmed successfully." });
        }
        else
        {
            return BadRequest(new { message = "Invalid or expired confirmation token." });
        }
    }

    [HttpPost("enable-mfa")]
    public async Task<IActionResult> EnableMfa([FromBody] string userEmail)
    {
        var user = await _userManager.FindByEmailAsync(userEmail);
        if (user == null)
        {
            return BadRequest(new { message = "User not found." });
        }

        user.TwoFactorEnabled = true;
        await _userManager.UpdateAsync(user);

        return Ok(new { message = "Two-factor authentication enabled for user." });
    }
}

public class AuthLoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class CustomRegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}