namespace api.Dtos;

public record AddToWatchlistDto(
    string Title,
    string Genre,
    string Description,
    int ReleaseYear,
    decimal Rating,
    string? PosterUrl = null
);