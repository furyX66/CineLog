using System.Text.Json.Serialization;

namespace api.Dtos;


public record AddToListDto(
    [property: JsonPropertyName("id")]
    int TmdbId,

    string Title,

    [property: JsonPropertyName("original_title")]
    string? OriginalTitle = null,

    string? Overview = null,

    [property: JsonPropertyName("poster_path")]
    string? PosterPath = null,

    [property: JsonPropertyName("backdrop_path")]
    string? BackdropPath = null,

    [property: JsonPropertyName("release_date")]
    string? ReleaseDate = null,

    [property: JsonPropertyName("vote_average")]
    decimal VoteAverage = 0,

    [property: JsonPropertyName("vote_count")]
    int VoteCount = 0,

    decimal Popularity = 0,
    bool Adult = false,
    int? Runtime = null,

    List<GenreDto>? Genres = null
);