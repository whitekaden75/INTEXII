using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class MovieRecommendationsController : ControllerBase
{
    private MovieRecommendationDbContext _context;

    public MovieRecommendationsController(MovieRecommendationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{showId}")]
    public async Task<ActionResult<IEnumerable<string>>> GetRecommendations(string showId)
    {
        var rec = await _context.MovieRecommendations.FindAsync(showId);

        if (rec == null)
        {
            return NotFound();
        }

        var recommendations = new List<string?>
        {
            rec.Recommendation1,
            rec.Recommendation2,
            rec.Recommendation3,
            rec.Recommendation4,
            rec.Recommendation5,
            rec.Recommendation6,
            rec.Recommendation7,
            rec.Recommendation8,
            rec.Recommendation9,
            rec.Recommendation10
        }
        .Where(r => !string.IsNullOrEmpty(r))
        .Cast<string>()
        .ToList();

        return recommendations;
    }
}