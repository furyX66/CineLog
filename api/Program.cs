using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using api.Dtos;
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

app.MapPost("/api/movies/{movieId}/watchlist",
        [Authorize] async (int movieId, ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);
            var movie = await db.Movies.FindAsync(movieId);
            if (movie is null) return Results.NotFound("Movie not found");

            var userMovie = await GetOrCreateUserMovie(db, userId, movieId);
            userMovie.InWatchlist = !userMovie.InWatchlist;

            await db.SaveChangesAsync();
            return Results.Ok(new { movieId, inWatchlist = userMovie.InWatchlist });
        })
    .WithName("ToggleWatchlist");

#endregion

#region LikeToggle

app.MapPost("/api/movies/{movieId}/like",
        [Authorize] async (int movieId, ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);
            var movie = await db.Movies.FindAsync(movieId);
            if (movie is null) return Results.NotFound("Movie not found");

            var userMovie = await GetOrCreateUserMovie(db, userId, movieId);

            userMovie.IsLiked = !userMovie.IsLiked;
            if (userMovie.IsLiked) userMovie.IsDisliked = false;

            await db.SaveChangesAsync();
            return Results.Ok(new { movieId, isLiked = userMovie.IsLiked });
        })
    .WithName("ToggleLike");

#endregion

#region DislikeToggle

app.MapPost("/api/movies/{movieId}/dislike",
        [Authorize] async (int movieId, ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);
            var movie = await db.Movies.FindAsync(movieId);
            if (movie is null) return Results.NotFound("Movie not found");

            var userMovie = await GetOrCreateUserMovie(db, userId, movieId);

            userMovie.IsDisliked = !userMovie.IsDisliked;
            if (userMovie.IsDisliked) userMovie.IsLiked = false;

            await db.SaveChangesAsync();
            return Results.Ok(new { movieId, isDisliked = userMovie.IsDisliked });
        })
    .WithName("ToggleDislike");

#endregion

#region GetWatched

app.MapPost("/api/movies/{movieId}/watched",
        [Authorize] async (int movieId, ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);
            var movie = await db.Movies.FindAsync(movieId);
            if (movie is null) return Results.NotFound("Movie not found");

            var userMovie = await GetOrCreateUserMovie(db, userId, movieId);
            userMovie.IsWatched = !userMovie.IsWatched;

            await db.SaveChangesAsync();
            return Results.Ok(new { movieId, isWatched = userMovie.IsWatched });
        })
    .WithName("ToggleWatched");

#endregion

#region GetLiked

app.MapGet("/api/movies/liked",
        [Authorize] async (ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);

            var likedMovies = await db.UserMovies
                .Where(um => um.UserId == userId && um.IsLiked)
                .Include(um => um.Movie)
                .Select(um => new
                {
                    um.Movie.Id,
                    um.Movie.Title,
                    um.Movie.PosterUrl,
                    um.Movie.Rating,
                    um.Movie.ReleaseYear,
                    um.IsWatched,
                    um.UserRating
                })
                .ToListAsync();

            return Results.Ok(likedMovies);
        })
    .WithName("GetLikedMovies");

#endregion

#region GetDislikeMovies
app.MapGet("/api/movies/disliked",
        [Authorize] async (ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);

            var dislikedMovies = await db.UserMovies
                .Where(um => um.UserId == userId && um.IsDisliked)
                .Include(um => um.Movie)
                .Select(um => new
                {
                    um.Movie.Id,
                    um.Movie.Title,
                    um.Movie.PosterUrl,
                    um.Movie.Rating,
                    um.Movie.ReleaseYear
                })
                .ToListAsync();

            return Results.Ok(dislikedMovies);
        })
    .WithName("GetDislikedMovies");
#endregion

#region GetWatchedMovies
app.MapGet("/api/movies/watched",
        [Authorize] async (ApplicationDbContext db, HttpContext http) =>
        {
            var userId = GetUserId(http);

            var watchedMovies = await db.UserMovies
                .Where(um => um.UserId == userId && um.IsWatched)
                .Include(um => um.Movie)
                .Select(um => new
                {
                    um.Movie.Id,
                    um.Movie.Title,
                    um.Movie.PosterUrl,
                    um.Movie.Rating,
                    um.Movie.ReleaseYear,
                    um.UserRating,
                    um.IsLiked,
                    um.IsDisliked
                })
                .ToListAsync();

            return Results.Ok(watchedMovies);
        })
    .WithName("GetWatchedMovies");
#endregion

#region GetWatchlist
app.MapGet("/api/movies/watchlist",
    [Authorize] async (ApplicationDbContext db, HttpContext http) =>
    {
        var userId = GetUserId(http);

        var watchlist = await db.UserMovies
            .Where(um => um.UserId == userId && um.InWatchlist)
            .Include(um => um.Movie)
            .Select(um => new
            {
                um.Movie.Id,
                um.Movie.Title,
                um.Movie.PosterUrl,
                um.Movie.Rating,
                um.Movie.ReleaseYear
            })
            .ToListAsync();

        return Results.Ok(watchlist);
    }).WithName("GetWatchlist");
#endregion

app.Run();