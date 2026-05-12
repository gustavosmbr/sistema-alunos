import axios from 'axios';
import { Aluno, CreateAlunoDto, UpdateAlunoDto } from '../domain/Aluno';
import { LoginDto, AuthResult } from '../domain/Usuario';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginDto): Promise<AuthResult> =>
    api.post('/auth/login', data).then(res => res.data)
};

export const alunoApi = {
  getAll: (): Promise<Aluno[]> =>
    api.get('/alunos').then(res => res.data),

  getById: (id: number): Promise<Aluno> =>
    api.get(`/alunos/${id}`).then(res => res.data),

  search: (term: string): Promise<Aluno[]> =>
    api.get(`/alunos/search?q=${encodeURIComponent(term)}`).then(res => res.data),

  create: (data: CreateAlunoDto): Promise<Aluno> =>
    api.post('/alunos', data).then(res => res.data),

  update: (id: number, data: UpdateAlunoDto): Promise<Aluno> =>
    api.put(`/alunos/${id}`, data).then(res => res.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/alunos/${id}`).then(res => res.data)
};

export default api;