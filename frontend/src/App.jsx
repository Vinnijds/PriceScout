// src/App.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function App() {
  // Pega o estado e as funções do Contexto
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
  logout(); // Limpa o contexto
  navigate('/login'); // Redireciona
};

  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ marginRight: '1rem' }}>Dashboard (Home)</Link>
        </div>

        <div>
          {isAuthenticated ? (
            // Se estiver logado
            <>
              <span style={{ marginRight: '1rem' }}>Olá, {user.nome}!</span>
              <button onClick={handleLogout}>Sair</button>
            </>
          ) : (
            // Se NÃO estiver logado
            <>
              <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
              <Link to="/register">Cadastro</Link>
            </>
          )}
        </div>
      </nav>

      <hr />
      <Outlet />
    </div>
  );
}

export default App;