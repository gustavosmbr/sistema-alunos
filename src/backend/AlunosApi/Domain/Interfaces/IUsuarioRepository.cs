using AlunosApi.Domain.Entities;

namespace AlunosApi.Domain.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByUsernameAsync(string username);
    Task<Usuario> CreateAsync(Usuario usuario);
}