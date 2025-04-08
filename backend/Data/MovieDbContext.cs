namespace backend.Data;
using Microsoft.EntityFrameworkCore;

public class MovieDbContext : DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
    {
    }
    public DbSet<Movie> Movies { get; set; }
    // public DbSet<MovieRecommendation> MovieRecommendations { get; set; }

    // protected override void OnModelCreating(ModelBuilder modelBuilder)
    //     {
    //         // Configure relationships for recommendations
    //         modelBuilder.Entity<MovieRecommendation>()
    //             .HasOne(mr => mr.Movie)
    //             .WithMany()
    //             .HasForeignKey(mr => mr.ShowId);

    //         modelBuilder.Entity<MovieRecommendation>()
    //             .HasOne(mr => mr.RecommendedMovie)
    //             .WithMany()
    //             .HasForeignKey(mr => mr.RecommendedShowId);
    //     }
}