using AlunosApi.Domain.Entities;
using AlunosApi.Domain.Interfaces;
using AlunosApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlunosApi.Infrastructure.Repositories;

public class AlunoRepository : IAlunoRepository
{
    private readonly AppDbContext _context;

    public AlunoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Aluno>> GetAllAsync()
    {
        return await _context.Alunos
            .OrderByDescending(a => a.DataCadastro)
            .ToListAsync();
    }

    public async Task<Aluno?> GetByIdAsync(int id)
    {
        return await _context.Alunos.FindAsync(id);
    }

    public async Task<Aluno?> GetByEmailAsync(string email)
    {
        return await _context.Alunos
            .FirstOrDefaultAsync(a => a.Email.ToLower() == email.ToLower());
    }

    public async Task<Aluno?> GetByCpfAsync(string cpf)
    {
        return await _context.Alunos
            .FirstOrDefaultAsync(a => a.Cpf == cpf);
    }

    public async Task<Aluno?> GetByMatriculaAsync(string matricula)
    {
        return await _context.Alunos
            .FirstOrDefaultAsync(a => a.Matricula == matricula);
    }

    public async Task<IEnumerable<Aluno>> SearchAsync(string termo)
    {
        return await _context.Alunos
            .Where(a => EF.Functions.Like(a.Nome, $"%{termo}%") ||
                        EF.Functions.Like(a.Email, $"%{termo}%") ||
                        EF.Functions.Like(a.Cpf, $"%{termo}%") ||
                        EF.Functions.Like(a.Matricula, $"%{termo}%"))
            .OrderByDescending(a => a.DataCadastro)
            .ToListAsync();
    }

    public async Task<Aluno> CreateAsync(Aluno aluno)
    {
        _context.Alunos.Add(aluno);
        await _context.SaveChangesAsync();
        return aluno;
    }

    public async Task<Aluno> UpdateAsync(Aluno aluno)
    {
        _context.Alunos.Update(aluno);
        await _context.SaveChangesAsync();
        return aluno;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var aluno = await _context.Alunos.FindAsync(id);
        if (aluno == null) return false;

        _context.Alunos.Remove(aluno);
        await _context.SaveChangesAsync();
        return true;
    }
}