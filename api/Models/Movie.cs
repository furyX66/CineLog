public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int ReleaseYear { get; set; }
    public decimal Rating { get; set; }
    public string? PosterUrl { get; set; } 
    
    public ICollection<UserMovie> UserMovies { get; set; } = new List<UserMovie>();
}

public class UserMovie
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public int MovieId { get; set; }
    public Movie Movie { get; set; } = null!;
    
    public bool IsWatched { get; set; } = false;
    public bool InWatchlist { get; set; } = false;
    public bool IsLiked { get; set; } = false;
    public bool IsDisliked { get; set; } = false; 
    public int? ReviewId { get; set; } 
    public int? UserRating { get; set; } 
}

