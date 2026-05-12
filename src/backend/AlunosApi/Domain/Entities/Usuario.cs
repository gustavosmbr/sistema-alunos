using AlunosApi.Domain.Enums;

namespace AlunosApi.Domain.Entities;

public class Usuario
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public TipoUsuario Role { get; set; } = TipoUsuario.Aluno;
}