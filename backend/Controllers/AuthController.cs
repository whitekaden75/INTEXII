namespace RootkitAuth.API.Controllers;


using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
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
        Console.WriteLine("Login attempt started.");
        Console.WriteLine($"Email provided: {model.Email}");

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            Console.WriteLine("User not found.");
            return BadRequest(new { message = "User not found." });
        }

        Console.WriteLine("User found. Attempting password sign-in.");
        var result = await _signInManager.PasswordSignInAsync(user, model.Password, isPersistent: true, lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            Console.WriteLine("Password sign-in failed.");
            return BadRequest(new { message = "Invalid password." });
        }

        Console.WriteLine("Password sign-in succeeded. Login successful.");
        return Ok(new { message = "Login successful." });
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        Console.WriteLine("Registration attempt started.");
        Console.WriteLine($"Email provided: {model.Email}");

        var user = new IdentityUser { UserName = model.Email, Email = model.Email };
        Console.WriteLine("Creating user...");

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            Console.WriteLine("User creation failed. Errors:");
            foreach (var error in result.Errors)
            {
                Console.WriteLine($"- {error.Description}");
            }
            return BadRequest(result.Errors);
        }

        Console.WriteLine("User created successfully. Signing in...");
        await _signInManager.SignInAsync(user, isPersistent: true);

        Console.WriteLine("Registration and sign-in successful.");
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