using System.Linq;
using AlunosApi.Application.DTOs;
using AlunosApi.Application.Interfaces;
using AlunosApi.Domain.Entities;
using AlunosApi.Domain.Interfaces;
using AlunosApi.Domain.Utils;

namespace AlunosApi.Application.UseCases;

public class AlunoService : IAlunoService
{
    private readonly IAlunoRepository _repository;

    public AlunoService(IAlunoRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<AlunoDto>> GetAllAsync()
    {
        var alunos = await _repository.GetAllAsync();
        return MapToDtoList(alunos);
    }

    public async Task<AlunoDto?> GetByIdAsync(int id)
    {
        var aluno = await _repository.GetByIdAsync(id);
        return aluno == null ? null : MapToDto(aluno);
    }

    public async Task<IEnumerable<AlunoDto>> SearchAsync(string termo)
    {
        var alunos = await _repository.SearchAsync(termo);
        return MapToDtoList(alunos);
    }

    public async Task<AlunoDto> CreateAsync(CreateAlunoDto dto)
    {
        if (!CpfValidator.Validar(dto.Cpf))
            throw new InvalidOperationException("CPF inválido");

        if (dto.DataNascimento.HasValue && dto.DataNascimento.Value.Date >= DateTime.Now.Date)
            throw new InvalidOperationException("A data de nascimento deve ser menor que a data atual");

        var existingEmail = await _repository.GetByEmailAsync(dto.Email);
        if (existingEmail != null)
            throw new InvalidOperationException("Email já cadastrado");

        var existingCpf = await _repository.GetByCpfAsync(dto.Cpf);
        if (existingCpf != null)
            throw new InvalidOperationException("CPF já cadastrado");

        var existingMatricula = await _repository.GetByMatriculaAsync(dto.Matricula);
        if (existingMatricula != null)
            throw new InvalidOperationException("Matrícula já cadastrada");

        var aluno = new Aluno
        {
            Nome = dto.Nome,
            Matricula = dto.Matricula,
            Email = dto.Email,
            Cpf = dto.Cpf,
            DataNascimento = dto.DataNascimento,
            Telefone = dto.Telefone,
            Endereco = dto.Endereco,
            DataCadastro = DateTime.Now,
            Ativo = true
        };

        var created = await _repository.CreateAsync(aluno);
        return MapToDto(created);
    }

    public async Task<AlunoDto> UpdateAsync(int id, UpdateAlunoDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            throw new InvalidOperationException("Aluno não encontrado");

        if (!CpfValidator.Validar(dto.Cpf))
            throw new InvalidOperationException("CPF inválido");

        if (dto.DataNascimento.HasValue && dto.DataNascimento.Value.Date >= DateTime.Now.Date)
            throw new InvalidOperationException("A data de nascimento deve ser menor que a data atual");

        var existingEmail = await _repository.GetByEmailAsync(dto.Email);
        if (existingEmail != null && existingEmail.Id != id)
            throw new InvalidOperationException("Email já está em uso");

        var existingCpf = await _repository.GetByCpfAsync(dto.Cpf);
        if (existingCpf != null && existingCpf.Id != id)
            throw new InvalidOperationException("CPF já está em uso");

        var existingMatricula = await _repository.GetByMatriculaAsync(dto.Matricula);
        if (existingMatricula != null && existingMatricula.Id != id)
            throw new InvalidOperationException("Matrícula já está em uso");

        existing.Nome = dto.Nome;
        existing.Matricula = dto.Matricula;
        existing.Email = dto.Email;
        existing.Cpf = dto.Cpf;
        existing.DataNascimento = dto.DataNascimento;
        existing.Telefone = dto.Telefone;
        existing.Endereco = dto.Endereco;
        existing.Ativo = dto.Ativo;

        var updated = await _repository.UpdateAsync(existing);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static AlunoDto MapToDto(Aluno aluno) => new()
    {
        Id = aluno.Id,
        Matricula = aluno.Matricula,
        Nome = aluno.Nome,
        Email = aluno.Email,
        Cpf = aluno.Cpf,
        DataNascimento = aluno.DataNascimento,
        Telefone = aluno.Telefone,
        Endereco = aluno.Endereco,
        DataCadastro = aluno.DataCadastro,
        Ativo = aluno.Ativo
    };

    private static IEnumerable<AlunoDto> MapToDtoList(IEnumerable<Aluno> alunos) =>
        alunos.Select(MapToDto);
}