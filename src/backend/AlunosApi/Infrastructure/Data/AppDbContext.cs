using AlunosApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AlunosApi.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public DbSet<Aluno> Alunos => Set<Aluno>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Aluno>(entity =>
        {
            entity.ToTable("Alunos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Cpf).IsRequired().HasMaxLength(11);
            entity.Property(e => e.Telefone).HasMaxLength(20);
            entity.Property(e => e.Endereco).HasMaxLength(200);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Cpf).IsUnique();
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("Usuarios");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.HasIndex(e => e.Username).IsUnique();
        });
    }
}