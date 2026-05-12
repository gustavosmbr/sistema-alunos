using AlunosApi.Application.DTOs;

namespace AlunosApi.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResultDto> LoginAsync(LoginDto dto);
}