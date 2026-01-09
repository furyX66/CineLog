using System.Text.Json.Serialization;
using api.Dtos;

public class MovieResponseDto
{
    public int Id { get; set; }

    public int TmdbId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    [JsonPropertyName("original_title")]
    public string? OriginalTitle { get; set; }
    
    public string? Overview { get; set; }
    
    [JsonPropertyName("poster_path")]
    public string? PosterPath { get; set; }
    
    [JsonPropertyName("backdrop_path")]
    public string? BackdropPath { get; set; }
    
    [JsonPropertyName("release_date")]
    public string? ReleaseDate { get; set; }
    
    [JsonPropertyName("vote_average")]
    public decimal VoteAverage { get; set; }
    
    [JsonPropertyName("vote_count")]
    public int VoteCount { get; set; }
    
    public decimal Popularity { get; set; }
    
    public bool Adult { get; set; }
    
    public int? Runtime { get; set; }
    
    public List<GenreRequestDto> Genres { get; set; } = new();
    
    public bool IsWatched { get; set; }
    
    public bool IsLiked { get; set; }
    
    public bool IsDisliked { get; set; }
    
    public bool InWatchlist { get; set; }
    
    public int? UserRating { get; set; }
}

public class MoviesListResponseDto
{
    public int count { get; set; }
    public List<MovieResponseDto> movies { get; set; }
}