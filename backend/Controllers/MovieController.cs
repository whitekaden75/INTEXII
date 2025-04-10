using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using Microsoft.AspNetCore.Authorization;

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
        var movies = await _context.Movies.ToListAsync();
        
        // Ensure all movies have at least an empty string for genre
        foreach (var movie in movies)
        {
            if (movie.Genre == null)
            {
                movie.Genre = "";
            }
        }
        
        return movies;
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
        try {
            // Explicitly check if the movie already exists by title to avoid duplicates
            var existingMovie = await _context.Movies
                .FirstOrDefaultAsync(m => m.Title == movie.Title);
            
            if (existingMovie != null)
            {
                return Conflict("A movie with this title already exists");
            }
            
            // Get highest show ID number
            var highestId = await _context.Movies
                .Where(m => m.ShowId.StartsWith("s"))
                .Select(m => m.ShowId.Substring(1))  // Remove the 's' prefix
                .ToListAsync();
                
            int nextNumber = 1;
            
            foreach (var idStr in highestId)
            {
                if (int.TryParse(idStr, out int idNum))
                {
                    if (idNum >= nextNumber)
                    {
                        nextNumber = idNum + 1;
                    }
                }
            }
            
            movie.ShowId = $"s{nextNumber}";
            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();
            
            // Return the newly created movie with its ID
            return CreatedAtAction(nameof(GetMovie), new { id = movie.ShowId }, movie);
        }
        catch (Exception ex) {
            Console.WriteLine($"Error creating movie: {ex.Message}");
            return StatusCode(500, "Failed to create movie");
        }
    }

    // PUT: api/movies/s1
    [HttpPut("{id}")]
    // [Authorize(Roles = "Administrator")]
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovie(string id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null)
        {
            return NotFound();
        }
        
        // First delete related ratings
        var relatedRatings = await _context.movies_ratings.Where(r => r.ShowId == id).ToListAsync();
        _context.movies_ratings.RemoveRange(relatedRatings);
        
        // Then delete the movie
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
