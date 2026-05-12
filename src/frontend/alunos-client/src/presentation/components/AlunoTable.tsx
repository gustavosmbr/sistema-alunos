import { Aluno } from '../../domain/Aluno';

interface AlunoTableProps {
  alunos: Aluno[];
  onEdit: (aluno: Aluno) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export function AlunoTable({ alunos, onEdit, onDelete, loading }: AlunoTableProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (alunos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Nenhum aluno encontrado</p>
        <p className="text-sm">Clique em "Novo Aluno" para adicionar</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '-';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (digits.length === 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Nome</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">CPF</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Telefone</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Cadastro</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => (
            <tr key={aluno.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{aluno.nome}</td>
              <td className="py-3 px-4 text-gray-600">{aluno.email}</td>
              <td className="py-3 px-4 text-gray-600">{formatCpf(aluno.cpf)}</td>
              <td className="py-3 px-4 text-gray-600">{formatPhone(aluno.telefone)}</td>
              <td className="py-3 px-4 text-gray-600">{formatDate(aluno.dataCadastro)}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${aluno.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {aluno.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(aluno)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(aluno.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Excluir"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}