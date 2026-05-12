# 🎓 Sistema de Cadastro de Alunos

Sistema profissional para gestão de alunos, desenvolvido com uma arquitetura moderna e robusta utilizando **.NET 8** no backend e **React** no frontend. O projeto segue rigorosamente os princípios de **Clean Architecture**, **DDD (Domain-Driven Design)** e **SOLID**.

## 🚀 Tecnologias Utilizadas

- **Backend**: .NET 8 (ASP.NET Core Web API)
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Banco de Dados**: SQLite (EF Core com suporte a migrations)
- **Validação**: Zod (Frontend) & Data Annotations + Custom Validation (Backend)
- **Máscaras**: jQuery Mask Plugin para uma experiência de usuário fluida
- **Autenticação**: JWT (JSON Web Token)

## ✨ Funcionalidades Principais

- **🔒 Autenticação Segura**: Sistema de login com proteção de rotas via JWT.
- **📋 Gestão Completa (CRUD)**:
  - Listagem, Cadastro, Edição e Exclusão de alunos.
  - Filtro de busca inteligente por Nome, Email ou CPF.
- **🔢 Ordenação Dinâmica**: Clique nos cabeçalhos das colunas para ordenar a listagem (A-Z / Z-A) em tempo real.
- **✅ Validações de Negócio Avançadas**:
  - **CPF**: Validação matemática real dos dígitos verificadores (Algoritmo da Receita Federal).
  - **Matrícula**: Campo numérico obrigatório e único no sistema.
  - **Telefone**: Validação de formato brasileiro (mínimo 10 dígitos com DDD).
  - **Email**: Verificação de duplicidade e formato.

## 🏗️ Estrutura do Projeto

```
sistema-alunos/
├── src/
│   ├── backend/
│   │   └── AlunosApi/
│   │       ├── Domain/          # Entidades, Regras de Negócio, Utils (Ex: CpfValidator)
│   │       ├── Application/    # Use Cases, DTOs, Mapeamentos
│   │       ├── Infrastructure/ # Persistência (EF Core), Repositórios, Migrations
│   │       └── Presentation/   # API Controllers e Configurações
│   │
│   └── frontend/
│       └── alunos-client/
│           ├── src/
│           │   ├── domain/      # Definições de Tipos e Interfaces
│           │   ├── application/ # Hooks customizados e serviços
│           │   ├── infrastructure/ # Cliente Axios e integração API
│           │   └── presentation/   # Componentes UI (Tailwind CSS) e Páginas
```

## 🛠️ Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/gustavosmbr/sistema-alunos.git
cd sistema-alunos
```

### 2. Rodar o Backend
```bash
cd src/backend/AlunosApi
dotnet restore
dotnet run
```
> A API estará disponível em: `http://localhost:5000`  
> Documentação Swagger: `http://localhost:5000/swagger`

### 3. Rodar o Frontend
```bash
cd src/frontend/alunos-client
npm install
npm run dev
```
> O sistema estará disponível em: `http://localhost:5173`

## 🔑 Credenciais de Acesso (Padrão)

- **Usuário**: `admin`
- **Senha**: `admin123`

---
Desenvolvido com foco em qualidade de código e melhores práticas de engenharia de software.
