using System.ComponentModel.DataAnnotations;

namespace api.Dtos;

public record RegisterRequestDto(
    [Required, MinLength(3)] 
    string Username,
    [Required, EmailAddress] 
    string Email,
    [Required, MinLength(8)] 
    string Password
);
