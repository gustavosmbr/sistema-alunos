import { useState, useMemo } from 'react';
import { Aluno } from '../../domain/Aluno';

interface AlunoTableProps {
  alunos: Aluno[];
  onEdit: (aluno: Aluno) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

type SortField = keyof Aluno;
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export function AlunoTable({ alunos, onEdit, onDelete, loading }: AlunoTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'nome', order: 'asc' });

  const sortedAlunos = useMemo(() => {
    const sortableAlunos = [...alunos];
    return sortableAlunos.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [alunos, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return (
        <svg className="w-3 h-3 text-gray-300 ml-1 inline" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l5-5 5 5H7zm0 4l5 5 5-5H7z" />
        </svg>
      );
    }
    return sortConfig.order === 'asc' ? (
      <svg className="w-3 h-3 text-orange-500 ml-1 inline" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 14l5-5 5 5H7z" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-orange-500 ml-1 inline" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5H7z" />
      </svg>
    );
  };

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

  const formatPhone = (phone: string | null) => {
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
            <th 
              onClick={() => handleSort('matricula')}
              className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 select-none"
            >
              Matrícula {renderSortIcon('matricula')}
            </th>
            <th 
              onClick={() => handleSort('nome')}
              className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 select-none"
            >
              Nome {renderSortIcon('nome')}
            </th>
            <th 
              onClick={() => handleSort('email')}
              className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 select-none"
            >
              Email {renderSortIcon('email')}
            </th>
            <th 
              onClick={() => handleSort('cpf')}
              className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 select-none"
            >
              CPF {renderSortIcon('cpf')}
            </th>
            <th 
              onClick={() => handleSort('telefone')}
              className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 select-none"
            >
              Telefone {renderSortIcon('telefone')}
            </th>
            <th 
              onClick={() => handleSort('dataCadastro')}
              className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 select-none"
            >
              Cadastro {renderSortIcon('dataCadastro')}
            </th>
            <th 
              onClick={() => handleSort('ativo')}
              className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 select-none"
            >
              Status {renderSortIcon('ativo')}
            </th>
            <th className="text-center py-3 px-4 font-semibold text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedAlunos.map((aluno) => (
            <tr key={aluno.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-600">{aluno.matricula}</td>
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