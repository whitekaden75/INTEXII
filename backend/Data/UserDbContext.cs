namespace backend.Data;
using Microsoft.EntityFrameworkCore;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
    {
    }
    public DbSet<UserRecommendation> UserRecommendations { get; set; }
}