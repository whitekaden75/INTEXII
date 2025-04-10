using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;

[Route("api/[controller]")]
[ApiController]
public class MoviesController : ControllerBase
{
    private MovieDbContext _context;

    public MoviesController(MovieDbContext context)
    {
        _context = context;
    }

    // GET: api/movies
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
    {
        return await _context.Movies.ToListAsync();
    }

    // GET: api/movies/s1
    [HttpGet("{id}")]
    public async Task<ActionResult<Movie>> GetMovie(string id)
    {
        var movie = await _context.Movies.FindAsync(id);

        if (movie == null)
        {
            return NotFound();
        }

        return movie;
    }

    // POST: api/movies
    [HttpPost]
    public async Task<ActionResult<Movie>> PostMovie(Movie movie)
    {
        // Get the highest numeric part of existing ShowIds
        var lastId = await _context.Movies
            .Where(m => m.ShowId.StartsWith("s"))
            .OrderByDescending(m => m.ShowId)
            .Select(m => m.ShowId)
            .FirstOrDefaultAsync();

        int nextNumber = 1;
        if (!string.IsNullOrEmpty(lastId) && int.TryParse(lastId.Substring(1), out var currentNum))
        {
            nextNumber = currentNum + 1;
        }

        movie.ShowId = $"s{nextNumber}";

        _context.Movies.Add(movie);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMovie), new { id = movie.ShowId }, movie);
    }

    // PUT: api/movies/s1
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMovie(string id, Movie movie)
    {
        if (id != movie.ShowId)
        {
            return BadRequest();
        }

        _context.Entry(movie).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MovieExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/movies/s1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovie(string id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null)
        {
            return NotFound();
        }

        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    private bool MovieExists(string id)
    {
        return _context.Movies.Any(e => e.ShowId == id);
    }
    [HttpGet("rating/average/{showId}")]
    public IActionResult GetAverageRating(string showId)
    {
        var ratings = _context.movies_ratings
            .Where(r => r.ShowId == showId)
            .Select(r => r.Rating)
            .ToList();

        if (ratings == null || ratings.Count == 0)
        {
            return Ok(new { showId, average = 0 });
        }

        var average = ratings.Average();
        return Ok(new { showId, average });
    }
    [HttpPost("rating")]
    public async Task<IActionResult> SubmitRating([FromBody] UserRating rating)
    {
        try
        {
            if (rating == null || string.IsNullOrWhiteSpace(rating.ShowId))
                return BadRequest("Invalid rating");

            var existing = await _context.movies_ratings
                .FirstOrDefaultAsync(r => r.UserId == rating.UserId && r.ShowId == rating.ShowId);

            if (existing != null)
            {
                existing.Rating = rating.Rating;
            }
            else
            {
                await _context.movies_ratings.AddAsync(rating);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Rating submitted successfully." });
        }
        catch (Exception ex)
        {
            Console.WriteLine("🔥 SubmitRating Error: " + ex.Message);
            return StatusCode(500, "Internal Server Error");
        }
    }

}
