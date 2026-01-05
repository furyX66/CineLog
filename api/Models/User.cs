using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }
    [MinLength(3), MaxLength(20)] 
    public string Username { get; set; } = string.Empty;
    [MinLength(6), MaxLength(50)] 
    public string Email { get; set; } = string.Empty;
    [MinLength(8), MaxLength(500)] 
    public string PasswordHash { get; set; } = string.Empty; 
    
    public ICollection<UserMovie> UserMovies { get; set; } = new List<UserMovie>();
}