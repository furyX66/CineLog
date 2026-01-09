using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using api.Dtos;
using api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")!));


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        };
    });

builder.Services.AddHttpClient();
builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

#region Helpers

static bool IsValidEmail(string email)
{
    if (string.IsNullOrWhiteSpace(email))
        return false;

    return Regex.IsMatch(email,
        @"^[^@\s]+@[^@\s\.]+\.[^@\.\s]+$");
}

static int GetUserId(HttpContext http)
{
    var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier);
    ArgumentNullException.ThrowIfNull(userIdClaim);
    return int.Parse(userIdClaim.Value);
}

static async Task<UserMovie> GetOrCreateUserMovie(ApplicationDbContext db, int userId, int movieId)
{
    var userMovie = await db.UserMovies
        .FirstOrDefaultAsync(um => um.UserId == userId && um.MovieId == movieId);

    if (userMovie is null)
    {
        userMovie = new UserMovie { UserId = userId, MovieId = movieId };
        db.UserMovies.Add(userMovie);
    }

    return userMovie;
}

static async Task<Movie> GetOrCreateMovie(ApplicationDbContext db, AddToListDto dto)
{
    var movie = await db.Movies
        .Include(m => m.MovieGenres)
        .ThenInclude(mg => mg.Genre)
        .FirstOrDefaultAsync(m => m.TmdbId == dto.TmdbId);

    bool isNewMovie = movie is null;

    if (isNewMovie)
    {
        movie = new Movie
        {
            TmdbId = dto.TmdbId,
            Title = dto.Title,
            OriginalTitle = dto.OriginalTitle,
            Overview = dto.Overview,
            PosterPath = dto.PosterPath,
            BackdropPath = dto.BackdropPath,
            ReleaseDate = dto.ReleaseDate,
            VoteAverage = dto.VoteAverage,
            VoteCount = dto.VoteCount,
            Popularity = dto.Popularity,
            Adult = dto.Adult,
            Runtime = dto.Runtime
        };
        db.Movies.Add(movie);
        await db.SaveChangesAsync();

        db.Entry(movie).State = EntityState.Detached;
        movie = await db.Movies
            .Include(m => m.MovieGenres)
            .ThenInclude(mg => mg.Genre)
            .FirstAsync(m => m.Id == movie.Id);
    }

    db.MovieGenres.RemoveRange(movie.MovieGenres);

    foreach (var genreDto in dto.Genres.DistinctBy(g => g.Id))
    {
        var genre = await db.Genres.FirstOrDefaultAsync(g => g.TmdbId == genreDto.Id);
        if (genre == null)
        {
            genre = new Genre
            {
                TmdbId = genreDto.Id,
                Name = genreDto.Name
            };
            db.Genres.Add(genre);
            await db.SaveChangesAsync();
        }

        db.MovieGenres.Add(new MovieGenre
        {
            MovieId = movie.Id,
            GenreId = genre.Id
        });
    }

    await db.SaveChangesAsync();
    return movie;
}

static async Task<List<MovieResponseDto>> GetMoviesList(
    ApplicationDbContext db,
    int userId,
    Expression<Func<UserMovie, bool>> filter)
{
    return await db.UserMovies
        .Where(um => um.UserId == userId)
        .Where(filter)
        .Select(um => new MovieResponseDto
        {
            Id = um.Movie.Id,
            TmdbId = um.Movie.TmdbId,
            Title = um.Movie.Title,
            OriginalTitle = um.Movie.OriginalTitle,
            Overview = um.Movie.Overview,
            PosterPath = um.Movie.PosterPath,
            BackdropPath = um.Movie.BackdropPath,
            ReleaseDate = um.Movie.ReleaseDate,
            VoteAverage = um.Movie.VoteAverage,
            VoteCount = um.Movie.VoteCount,
            Popularity = um.Movie.Popularity,
            Adult = um.Movie.Adult,
            Runtime = um.Movie.Runtime,
            Genres = um.Movie.MovieGenres
                .Select(mg => new GenreRequestDto()
                {
                    Id = mg.Genre.Id,
                    Name = mg.Genre.Name
                }).ToList(),
            IsWatched = um.IsWatched,
            IsLiked = um.IsLiked,
            IsDisliked = um.IsDisliked,
            InWatchlist = um.InWatchlist,
            UserRating = um.UserRating
        })
        .ToListAsync();
}

#endregion

#region Register

app.MapPost("/api/auth/register", async (RegisterRequestDto requestDto, ApplicationDbContext db, JwtService jwt) =>
    {
        if (string.IsNullOrWhiteSpace(requestDto.Username) || requestDto.Username.Length < 3)
            return Results.BadRequest("Username must be at least 3 characters long");

        if (!IsValidEmail(requestDto.Email))
            return Results.BadRequest("Invalid email format (example: user@example.com)");

        if (requestDto.Password.Length < 8)
            return Results.BadRequest("Password must be at least 8 characters long");

        if (await db.Users.AnyAsync(u => u.Username == requestDto.Username))
            return Results.Conflict("Username is already taken");

        if (await db.Users.AnyAsync(u => u.Email == requestDto.Email))
            return Results.Conflict("Email is already taken");

        var user = new User
        {
            Username = requestDto.Username,
            Email = requestDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(requestDto.Password),
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var token = jwt.GenerateToken(user);

        return Results.Created($"/api/users/{user.Id}",
            new AuthResponseDto(
                User: new UserResponseDto(user.Id, user.Username, user.Email),
                Token: token
            ));
    })
    .WithName("Register");

#endregion

#region Login

app.MapPost("/api/auth/login", async (LoginRequestDto requestDto, ApplicationDbContext db, JwtService jwt) =>
    {
        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Username == requestDto.Identifier.Trim() || u.Email == requestDto.Identifier);

        if (user is null || !BCrypt.Net.BCrypt.Verify(requestDto.Password, user.PasswordHash))
            return Results.Problem("Invalid credentials", statusCode: 401);

        var token = jwt.GenerateToken(user);

        return Results.Ok(new AuthResponseDto(
            User: new UserResponseDto(user.Id, user.Username, user.Email),
            Token: token
        ));
    })
    .WithName("Login");

#endregion

#region Watchlist

app.MapPost("/api/movies/watchlist",
        [Authorize] async (AddToListDto dto, ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);
            var movie = await GetOrCreateMovie(db, dto);
            var userMovie = await GetOrCreateUserMovie(db, userId, movie.Id);
            userMovie.InWatchlist = !userMovie.InWatchlist;

            await db.SaveChangesAsync();
            return Results.Ok(new
            {
                movieId = movie.Id,
                tmdbId = dto.TmdbId,
                inWatchlist = userMovie.InWatchlist
            });
        })
    .WithName("ToggleWatchlist");

#endregion

#region LikeToggle

app.MapPost("/api/movies/like",
        [Authorize] async (AddToListDto dto, ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);
            var movie = await GetOrCreateMovie(db, dto);
            var userMovie = await GetOrCreateUserMovie(db, userId, movie.Id);
            userMovie.IsLiked = !userMovie.IsLiked;
            if (userMovie.IsLiked) userMovie.IsDisliked = false;

            await db.SaveChangesAsync();
            return Results.Ok(new
            {
                movieId = movie.Id,
                tmdbId = dto.TmdbId,
                isLiked = userMovie.IsLiked
            });
        })
    .WithName("ToggleLike");

#endregion

#region DislikeToggle

app.MapPost("/api/movies/dislike",
        [Authorize] async (AddToListDto dto, ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);
            var movie = await GetOrCreateMovie(db, dto);
            var userMovie = await GetOrCreateUserMovie(db, userId, movie.Id);
            userMovie.IsDisliked = !userMovie.IsDisliked;
            if (userMovie.IsDisliked) userMovie.IsLiked = false;

            await db.SaveChangesAsync();
            return Results.Ok(new
            {
                movieId = movie.Id,
                tmdbId = dto.TmdbId,
                isDisliked = userMovie.IsDisliked
            });
        })
    .WithName("ToggleDislike");

#endregion

#region Watched

app.MapPost("/api/movies/watched",
        [Authorize] async (AddToListDto dto, ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);
            var movie = await GetOrCreateMovie(db, dto);
            var userMovie = await GetOrCreateUserMovie(db, userId, movie.Id);
            userMovie.IsWatched = !userMovie.IsWatched;

            await db.SaveChangesAsync();
            return Results.Ok(new
            {
                movieId = movie.Id,
                tmdbId = dto.TmdbId,
                isWatched = userMovie.IsWatched
            });
        })
    .WithName("ToggleWatched");

#endregion

#region GetWatchlist

app.MapGet("/api/movies/watchlist",
    [Authorize] async (ApplicationDbContext db, HttpContext http) =>
    {
        var userId = GetUserId(http);

        var movies = await GetMoviesList(db, userId, um => um.InWatchlist);

        return Results.Ok(new
        {
            count = movies.Count,
            movies = movies
        });
    }).WithName("GetWatchlist");

#endregion

#region GetWatched

app.MapGet("/api/movies/watched",
        [Authorize] async (ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);
            var movies = await GetMoviesList(db, userId, um => um.IsWatched);

            return Results.Ok(new
            {
                count = movies.Count,
                movies = movies
            });
        })
    .WithName("GetWatchedMovies");

#endregion

#region GetLiked

app.MapGet("/api/movies/liked",
        [Authorize] async (ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);

            var movies = await GetMoviesList(db, userId, um => um.IsLiked);

            return Results.Ok(new
            {
                count = movies.Count,
                movies = movies
            });
        })
    .WithName("GetLikedMovies");

#endregion

#region GetDislikeMovies

app.MapGet("/api/movies/disliked",
        [Authorize] async (ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);

            var movies = await GetMoviesList(db, userId, um => um.IsDisliked);

            return Results.Ok(new
            {
                count = movies.Count,
                movies = movies
            });
        })
    .WithName("GetDislikedMovies");

#endregion

#region GetMoviesCounts

app.MapGet("/api/movies/counts",
        [Authorize] async (ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);

            var counts = await db.UserMovies
                .Where(um => um.UserId == userId)
                .GroupBy(um => um.UserId)
                .Select(g => new
                {
                    liked = g.Count(um => um.IsLiked),
                    disliked = g.Count(um => um.IsDisliked),
                    watched = g.Count(um => um.IsWatched),
                    watchlist = g.Count(um => um.InWatchlist)
                })
                .FirstOrDefaultAsync();

            if (counts is null)
            {
                return Results.Ok(new
                {
                    liked = 0,
                    disliked = 0,
                    watched = 0,
                    watchlist = 0
                });
            }

            return Results.Ok(counts);
        })
    .WithName("GetMoviesCounts");

#endregion

#region GetMovieStatus

app.MapGet("/api/movies/{tmdbId}/status", [Authorize] async (
        int tmdbId,
        ApplicationDbContext db,
        HttpContext http) =>
    {
        var userId = GetUserId(http);

        var userMovie = await db.UserMovies
            .Where(um => um.UserId == userId && um.Movie.TmdbId == tmdbId)
            .Include(um => um.Movie)
            .FirstOrDefaultAsync();

        if (userMovie is null)
            return Results.Ok(new
            {
                isLiked = false,
                isDisliked = false,
                inWatchlist = false,
                isWatched = false,
                userRating = (int?)null
            });

        return Results.Ok(new
        {
            movieId = userMovie.Movie.Id,
            tmdbId = userMovie.Movie.TmdbId,
            title = userMovie.Movie.Title,

            isLiked = userMovie.IsLiked,
            isDisliked = userMovie.IsDisliked,
            inWatchlist = userMovie.InWatchlist,
            isWatched = userMovie.IsWatched,
            userRating = userMovie.UserRating
        });
    })
    .WithName("GetMovieStatus");

#endregion

#region ValidateToken

app.MapGet("/api/auth/validate", (HttpContext http) =>
    {
        var userId = GetUserId(http);

        if (userId == 0)
            return Results.Unauthorized();

        return Results.Ok(new { isValid = true });
    })
    .RequireAuthorization()
    .WithName("ValidateToken");

#endregion

app.Run();