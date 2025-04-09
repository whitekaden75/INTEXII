namespace RootkitAuth.API.Controllers;


using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("auth/[controller]")]
public class AuthController : ControllerBase
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;

    public AuthController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        Console.WriteLine($"[AuthController:Login] Received login request for email: {model.Email}");
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            Console.WriteLine("[AuthController:Login] User not found.");
            return BadRequest(new { message = "User not found." });
        }

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, isPersistent: true, lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            Console.WriteLine("[AuthController:Login] Invalid password.");
            return BadRequest(new { message = "Invalid password." });
        }

        Console.WriteLine("[AuthController:Login] Login successful.");
        return Ok(new { message = "Login successful." });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        Console.WriteLine($"[AuthController:Register] Received registration for email: {model.Email}");
        var user = new IdentityUser { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            Console.WriteLine("[AuthController:Register] Registration errors:");
            foreach (var err in result.Errors)
            {
                Console.WriteLine($"   - {err.Description}");
            }
            return BadRequest(result.Errors);
        }

        await _signInManager.SignInAsync(user, isPersistent: true);
        Console.WriteLine("[AuthController:Register] Registration successful.");
        return Ok(new { message = "Registration successful." });
    }


    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}