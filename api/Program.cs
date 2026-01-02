using System.Text;
using api.Dtos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

Console.WriteLine($"Key from program: {builder.Configuration["Jwt:Key"]!}");

builder.Services.AddScoped<JwtService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapPost("/api/auth/register", async (RegisterRequestDto requestDto, ApplicationDbContext db, JwtService jwt) =>
    {
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

app.MapPost("/api/auth/login", async (LoginRequestDto requestDto, ApplicationDbContext db, JwtService jwt) =>
    {
        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Username == requestDto.Identifier || u.Email == requestDto.Identifier);
        
        if (user is null || !BCrypt.Net.BCrypt.Verify(requestDto.Password, user.PasswordHash))
            return Results.Problem("Invalid credentials", statusCode: 401); 
        
        var token = jwt.GenerateToken(user);

        return Results.Ok( new AuthResponseDto(
            User: new UserResponseDto(user.Id, user.Username, user.Email),
            Token: token
        ));
    })
    .WithName("Login");

app.Run();