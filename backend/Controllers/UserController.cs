using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;

[Route("api/[controller]")]
[ApiController]
public class UserRecommendationsController : ControllerBase
{
    private UserDbContext _context;

    public UserRecommendationsController(UserDbContext context)
    {
        _context = context;
    }

    // GET: api/UserRecommendations/1
    [HttpGet("{userId}")]
    public async Task<ActionResult<IEnumerable<string>>> GetUserRecommendations(int userId)
    {
        var userRec = await _context.UserRecommendations.FindAsync(userId);

        if (userRec == null)
        {
            return NotFound();
        }

        var recommendations = new List<string?>
        {
            userRec.Recommendation1,
            userRec.Recommendation2,
            userRec.Recommendation3,
            userRec.Recommendation4,
            userRec.Recommendation5,
            userRec.Recommendation6,
            userRec.Recommendation7,
            userRec.Recommendation8,
            userRec.Recommendation9,
            userRec.Recommendation10
        }
        .Where(r => !string.IsNullOrEmpty(r))
        .Cast<string>()
        .ToList();

        return recommendations;
    }
    
}