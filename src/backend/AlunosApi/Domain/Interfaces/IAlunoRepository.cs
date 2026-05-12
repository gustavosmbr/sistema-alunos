using AlunosApi.Domain.Entities;

namespace AlunosApi.Domain.Interfaces;

public interface IAlunoRepository
{
    Task<IEnumerable<Aluno>> GetAllAsync();
    Task<Aluno?> GetByIdAsync(int id);
    Task<Aluno?> GetByEmailAsync(string email);
    Task<Aluno?> GetByCpfAsync(string cpf);
    Task<Aluno?> GetByMatriculaAsync(string matricula);
    Task<IEnumerable<Aluno>> SearchAsync(string termo);
    Task<Aluno> CreateAsync(Aluno aluno);
    Task<Aluno> UpdateAsync(Aluno aluno);
    Task<bool> DeleteAsync(int id);
}