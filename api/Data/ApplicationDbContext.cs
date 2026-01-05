using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Movie> Movies { get; set; } = null!;
    public DbSet<UserMovie> UserMovies { get; set; } = null!;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<UserMovie>()
            .HasKey(um => new { um.UserId, um.MovieId });

        modelBuilder.Entity<UserMovie>()
            .HasOne(um => um.User)
            .WithMany(u => u.UserMovies)
            .HasForeignKey(um => um.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserMovie>()
            .HasOne(um => um.Movie)
            .WithMany(m => m.UserMovies)
            .HasForeignKey(um => um.MovieId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<UserMovie>()
            .HasIndex(um => um.UserId);

        modelBuilder.Entity<UserMovie>()
            .ToTable(t => t.HasCheckConstraint(
                "CK_UserMovie_NoBothLikeDislike",
                "\"IsLiked\" = false OR \"IsDisliked\" = false"));
    }
}