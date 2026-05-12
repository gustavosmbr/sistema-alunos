import { useState, useEffect, useCallback } from 'react';
import { Aluno, CreateAlunoDto, UpdateAlunoDto } from '../../domain/Aluno';
import { alunoApi } from '../../infrastructure/api';

export function useAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await alunoApi.getAll();
      setAlunos(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchAlunos = useCallback(async (term: string) => {
    if (!term || term.trim() === '') {
      await fetchAlunos();
      return;
    }
    try {
      setLoading(true);
      const data = await alunoApi.search(term);
      setAlunos(data);
      setError(null);
    } catch (err) {
      setError('Erro na busca');
    } finally {
      setLoading(false);
    }
  }, [fetchAlunos]);

  const createAluno = useCallback(async (data: CreateAlunoDto) => {
    const aluno = await alunoApi.create(data);
    setAlunos(prev => [aluno, ...prev]);
    return aluno;
  }, []);

  const updateAluno = useCallback(async (id: number, data: UpdateAlunoDto) => {
    const aluno = await alunoApi.update(id, data);
    setAlunos(prev => prev.map(a => a.id === id ? aluno : a));
    return aluno;
  }, []);

  const deleteAluno = useCallback(async (id: number) => {
    await alunoApi.delete(id);
    setAlunos(prev => prev.filter(a => a.id !== id));
  }, []);

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  return {
    alunos,
    loading,
    error,
    fetchAlunos,
    searchAlunos,
    createAluno,
    updateAluno,
    deleteAluno
  };
}