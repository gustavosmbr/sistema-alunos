# Sistema de Cadastro de Alunos

Sistema completo com API em .NET 8 + React, utilizando Clean Architecture e SOLID.

## Stack Tecnologica

- **Backend**: .NET 8 (ASP.NET Core Web API)
- **Frontend**: React 18 + TypeScript + Vite
- **Banco**: SQLite
- **Auth**: JWT (JSON Web Token)
- **Arquitetura**: Clean Architecture (separada)

## Estrutura do Projeto

```
sistema-alunos/
├── src/
│   ├── backend/
│   │   └── AlunosApi/
│   │       ├── Domain/          # Entidades, interfaces, enums
│   │       ├── Application/    # Use cases, DTOs, services
│   │       ├── Infrastructure/ # DbContext, repositories
│   │       └── Presentation/   # Controllers
│   │
│   └── frontend/
│       └── alunos-client/
│           ├── src/
│           │   ├── domain/      # Tipos, entidades
│           │   ├── application/ # Hooks
│           │   ├── infrastructure/ # API client
│           │   └── presentation/   # Componentes, páginas
```

## Como Executar

### Backend (.NET 8)

```bash
cd src/backend/AlunosApi
dotnet restore
dotnet run
```

A API estará disponível em: `http://localhost:5000`
Swagger: `http://localhost:5000/swagger`

### Frontend (React)

```bash
cd src/frontend/alunos-client
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## Credenciais Padrao

- **Usuário**: admin
- **Senha**: admin123

## Funcionalidades

### Autenticacao
- Login com JWT
- Routes protegidas
- Logout

### CRUD Alunos
- Listar todos os alunos
- Pesquisar por nome/email/CPF
- Cadastrar novo aluno
- Editar aluno existente
- Excluir aluno
- Status ativo/inativo

### Dados do Aluno
- Nome (obrigatorio)
- Email (obrigatorio, unico)
- CPF (obrigatorio, unico)
- Data de Nascimento
- Telefone
- Endereco
- Data de Cadastro (automatico)
- Status (ativo/inativo)

## Camadas (Clean Architecture)

### Domain Layer
- Entities: Aluno, Usuario
- Interfaces: IAlunoRepository, IUsuarioRepository
- Enums: TipoUsuario

### Application Layer
- DTOs: AlunoDto, CreateAlunoDto, UpdateAlunoDto, LoginDto
- Use Cases: AlunoService, AuthService
- Interfaces: IAlunoService, IAuthService

### Infrastructure Layer
- Data: AppDbContext (EF Core + SQLite)
- Repositories: AlunoRepository, UsuarioRepository

### Presentation Layer
- Controllers: AlunosController, AuthController
- Filters: JwtAuthFilter