import { useState, useCallback, useEffect } from 'react';
import { LoginDto, AuthResult } from '../../domain/Usuario';
import { authApi } from '../../infrastructure/api';

interface User {
  username: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (data: LoginDto): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const result: AuthResult = await authApi.login(data);
      
      if (result.success && result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify({
          username: result.username,
          role: result.role
        }));
        setUser({ username: result.username!, role: result.role! });
        return true;
      }
      
      setError(result.message || 'Erro no login');
      return false;
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  };
}