import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './presentation/context/AuthContext';
import { PrivateRoute } from './presentation/components/PrivateRoute';
import { LoginPage } from './presentation/pages/LoginPage';
import { AlunosPage } from './presentation/pages/AlunosPage';
import './index.css';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/alunos" element={<AlunosPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/alunos" replace />} />
          <Route path="*" element={<Navigate to="/alunos" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}