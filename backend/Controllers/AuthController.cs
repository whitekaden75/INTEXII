namespace RootkitAuth.API.Controllers;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/[controller]")]
public class AuthController : ControllerBase
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<AuthController> _logger;

    public AuthController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, ILogger<AuthController> logger)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthLoginRequest model)
    {
        _logger.LogInformation("[AuthController:Login] Received login request for email: {Email}", model.Email);
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            _logger.LogWarning("[AuthController:Login] User not found for email: {Email}", model.Email);
            return BadRequest(new { message = "User not found." });
        }
        _logger.LogInformation("[AuthController:Login] User found: {UserId}", user.Id);

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, isPersistent: true, lockoutOnFailure: false);
        _logger.LogInformation("[AuthController:Login] PasswordSignInAsync result: Succeeded={Succeeded}, RequiresTwoFactor={RequiresTwoFactor}",
            result.Succeeded, result.RequiresTwoFactor);

        if (!result.Succeeded)
        {
            _logger.LogWarning("[AuthController:Login] Invalid password for email: {Email}", model.Email);
            return BadRequest(new { message = "Invalid password." });
        }

        _logger.LogInformation("[AuthController:Login] Login successful for email: {Email}", model.Email);
        return Ok(new { message = "Login successful." });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthRegisterRequest model)
    {
        _logger.LogInformation("[AuthController:Register] Received registration for email: {Email}", model.Email);
        var user = new IdentityUser { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);
        _logger.LogInformation("[AuthController:Register] CreateAsync result: Succeeded={Succeeded}", result.Succeeded);

        if (!result.Succeeded)
        {
            _logger.LogWarning("[AuthController:Register] Registration failed for email: {Email}. Errors: {Errors}",
                model.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
            return BadRequest(result.Errors);
        }

        await _signInManager.SignInAsync(user, isPersistent: true);
        _logger.LogInformation("[AuthController:Register] SignInAsync completed for email: {Email}", model.Email);
        return Ok(new { message = "Registration successful." });
    }

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
}