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
}
