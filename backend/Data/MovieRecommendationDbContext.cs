namespace backend.Data;
using Microsoft.EntityFrameworkCore;

public class MovieRecommendationDbContext : DbContext
{
    public MovieRecommendationDbContext(DbContextOptions<MovieRecommendationDbContext> options) : base(options)
    {
    }
    public DbSet<MovieRecommendation> MovieRecommendations { get; set; }

}