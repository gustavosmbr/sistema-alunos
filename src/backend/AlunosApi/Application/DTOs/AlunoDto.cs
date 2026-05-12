namespace AlunosApi.Application.DTOs;

public class AlunoDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public DateTime? DataNascimento { get; set; }
    public string? Telefone { get; set; }
    public string? Endereco { get; set; }
    public DateTime DataCadastro { get; set; }
    public bool Ativo { get; set; }
}