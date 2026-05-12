using AlunosApi.Application.DTOs;
using AlunosApi.Application.Interfaces;
using AlunosApi.Domain.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AlunosApi.Application.UseCases;

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _repository;
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;

    public AuthService(IUsuarioRepository repository, IConfiguration configuration)
    {
        _repository = repository;
        _secretKey = configuration["Jwt:SecretKey"] ?? "MinhaChaveSecretaSuperSegura2024!@#$%";
        _issuer = configuration["Jwt:Issuer"] ?? "AlunosApi";
        _audience = configuration["Jwt:Audience"] ?? "AlunosApiClient";
    }

    public async Task<AuthResultDto> LoginAsync(LoginDto dto)
    {
        var usuario = await _repository.GetByUsernameAsync(dto.Username);

        if (usuario == null)
            return new AuthResultDto { Success = false, Message = "Usuário não encontrado" };

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
            return new AuthResultDto { Success = false, Message = "Senha incorreta" };

        var token = GenerateToken(usuario);

        return new AuthResultDto
        {
            Success = true,
            Token = token,
            Username = usuario.Username,
            Role = usuario.Role.ToString()
        };
    }

    private string GenerateToken(Domain.Entities.Usuario usuario)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, usuario.Username),
            new Claim(ClaimTypes.Role, usuario.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.Now.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}