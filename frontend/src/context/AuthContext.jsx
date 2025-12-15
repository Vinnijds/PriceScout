// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // Nosso serviço Axios

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Cria o Provedor (o componente que vai "envelopar" o app)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber se já carregou o user

  // 3. Efeito para carregar o token do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 4. Função de Login
  const login = (newToken, userData) => {
    // Salva no localStorage
    localStorage.setItem('token', newToken); // <-- LINHA CORRIGIDA (estava faltando no seu original)
    localStorage.setItem('user', JSON.stringify(userData));

    // Salva no State
    setToken(newToken);
    setUser(userData);

    // A linha 'navigate('/')' FOI REMOVIDA (esta é a correção principal)
  };

  // 5. Função de Logout
  const logout = () => {
    // Limpa o localStorage
    localStorage.removeItem('token'); // <-- LINHA CORRIGIDA (estava faltando no seu original)
    localStorage.removeItem('user');

    // Limpa o State
    setToken(null);
    setUser(null);

    // A linha 'navigate('/login')' FOI REMOVIDA (esta é a correção principal)
  };

  // 6. Função para atualizar os dados do usuário
  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // 7. O valor que será compartilhado com todos os componentes "filho"
  const value = {
    user,
    token,
    isAuthenticated: !!user, // !! transforma 'user' em booleano (true/false)
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Só renderiza o app depois de carregar o user */}
    </AuthContext.Provider>
  );
}

// 8. Hook customizado para facilitar o uso do contexto
export function useAuth() {
  return useContext(AuthContext);
}