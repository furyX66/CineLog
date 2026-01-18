namespace api.Dtos;

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword);