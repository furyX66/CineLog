using System.Text.Json.Serialization;

namespace api.Dtos;

public class GenreRequestDto
{
    [JsonPropertyName("id")]  
    public int Id { get; set; }
    
    [JsonPropertyName("name")] 
    public string Name { get; set; } = string.Empty;
}