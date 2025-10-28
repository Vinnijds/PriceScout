// src/App.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {/* --- MUDANÇA AQUI --- */}
          {/* O Link "Home" agora aponta para /dashboard */}
          <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
          {/* --- FIM DA MUDANÇA --- */}
        </div>

        <div>
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '1rem' }}>Olá, {user.nome}!</span>
              <button onClick={handleLogout}>Sair</button>
            </>
          ) : (
            // (Este <></> nunca será mostrado se a rota estiver protegida,
            // mas é bom manter caso você mude de ideia)
            <>
              <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
              <Link to="/register">Cadastro</Link>
            </>
          )}
        </div>
      </nav>

      <hr />
      {/* O Outlet renderizará o Dashboard (ou outras páginas protegidas) */}
      <Outlet /> 
    </div>
  );
}

export default App;