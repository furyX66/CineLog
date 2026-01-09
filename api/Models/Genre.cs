namespace api.Models;

public class Genre
{
    public int Id { get; set; }
    public int TmdbId { get; set; } 
    public string Name { get; set; } = string.Empty;
    
    public List<MovieGenre> MovieGenres { get; set; } = new();
}

public class MovieGenre
{
    public int MovieId { get; set; }
    public Movie Movie { get; set; } = null!;
    
    public int GenreId { get; set; }
    public Genre Genre { get; set; } = null!;
}