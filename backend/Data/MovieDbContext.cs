namespace backend.Data;
using Microsoft.EntityFrameworkCore;

public class MovieDbContext : DbContext
{
    

    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
    {
    }
    public DbSet<Movie> Movies { get; set; }
    public DbSet<UserRating> movies_ratings { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserRating>()
            .HasKey(r => new { r.UserId, r.ShowId }); // 👈 composite primary key
    }

}