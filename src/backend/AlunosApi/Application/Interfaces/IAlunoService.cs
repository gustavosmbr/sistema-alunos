using AlunosApi.Application.DTOs;

namespace AlunosApi.Application.Interfaces;

public interface IAlunoService
{
    Task<IEnumerable<AlunoDto>> GetAllAsync();
    Task<AlunoDto?> GetByIdAsync(int id);
    Task<IEnumerable<AlunoDto>> SearchAsync(string termo);
    Task<AlunoDto> CreateAsync(CreateAlunoDto dto);
    Task<AlunoDto> UpdateAsync(int id, UpdateAlunoDto dto);
    Task<bool> DeleteAsync(int id);
}