using System.Text.Json.Serialization;
using api.Dtos;

public class Movie
{
    public int Id { get; set; }
    public int TmdbId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? OriginalTitle { get; set; }
    public string? Overview { get; set; }
    public string? PosterPath { get; set; }
    public string? BackdropPath { get; set; }
    public string? ReleaseDate { get; set; }      
    public decimal VoteAverage { get; set; }
    public int VoteCount { get; set; }
    public decimal Popularity { get; set; }
    public bool Adult { get; set; }
    public int? Runtime { get; set; } 
    [JsonPropertyName("genres")]
    public List<GenreDto> Genres { get; set; } = new();
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

