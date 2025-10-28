// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  // Pega o estado de autenticação do nosso Contexto
  const { isAuthenticated, loading } = useAuth();

  // Se ainda estiver carregando a info do localStorage, não faça nada
  if (loading) {
    return <div>Carregando...</div>; 
  }

  // Se NÃO estiver autenticado...
  if (!isAuthenticated) {
    // ...redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza a rota filha (o Dashboard)
  return <Outlet />;
}

export default ProtectedRoute;