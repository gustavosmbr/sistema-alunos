export interface Aluno {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string | null;
  telefone: string | null;
  endereco: string | null;
  dataCadastro: string;
  ativo: boolean;
}

export interface CreateAlunoDto {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento?: string | null;
  telefone?: string | null;
  endereco?: string | null;
}

export interface UpdateAlunoDto extends CreateAlunoDto {
  ativo: boolean;
}