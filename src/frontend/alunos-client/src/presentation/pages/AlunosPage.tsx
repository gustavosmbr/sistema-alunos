import { useState, useCallback } from 'react';
import { useAlunos } from '../../application/hooks/useAlunos';
import { Header } from '../components/Header';
import { AlunoTable } from '../components/AlunoTable';
import { AlunoForm } from '../components/AlunoForm';
import { Aluno, CreateAlunoDto, UpdateAlunoDto } from '../../domain/Aluno';

export function AlunosPage() {
  const { alunos, loading, searchAlunos, fetchAlunos, createAluno, updateAluno, deleteAluno, error } = useAlunos();
  const [showForm, setShowForm] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchAlunos(term);
    } else {
      fetchAlunos();
    }
  }, [searchAlunos, fetchAlunos]);

  const handleShowAll = () => {
    setSearchTerm('');
    fetchAlunos();
  };

  const handleSubmit = async (data: CreateAlunoDto | UpdateAlunoDto) => {
    setFormLoading(true);
    try {
      if (editingAluno) {
        await updateAluno(editingAluno.id, data as UpdateAlunoDto);
      } else {
        await createAluno(data as CreateAlunoDto);
      }
      setShowForm(false);
      setEditingAluno(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao salvar aluno';
      alert(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await deleteAluno(id);
      } catch (err) {
        alert('Erro ao excluir aluno');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAluno(null);
  };

  const handleNewClick = () => {
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Sistema de Alunos" 
        showNewButton={true} 
        onNewClick={handleNewClick} 
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome, matrícula, email ou CPF..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <button
            onClick={handleShowAll}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Ver todos
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <AlunoTable
            alunos={alunos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </main>

      {showForm && (
        <AlunoForm
          initialData={editingAluno || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={formLoading}
        />
      )}
    </div>
  );
}