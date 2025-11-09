// src/App.jsx (VERSÃO ATUALIZADA COM O NOVO HEADER)
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
// Importa os ícones novos
import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Se não estiver autenticado (embora o ProtectedRoute já bloqueie)
  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div style={styles.pageContainer}>
      {/* === NOVO HEADER === */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          
          {/* Logo */}
          <Link to="/dashboard" style={styles.logo}>
            {/* Usando o mesmo logo da Home, mas podemos trocar */}
            <img src="/logo.png" alt="PriceScout Logo" style={styles.logoImg} />
            PriceScout
          </Link>

          {/* Barra de Busca (Visual, sem função ainda) */}
          <div style={styles.searchBar}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Pesquisar..."
              style={styles.searchInput}
            />
          </div>

          {/* Info do Usuário */}
          <div style={styles.userInfo}>
            <FaUserCircle size={24} style={styles.userAvatar} />
            <span style={styles.userName}>{user.nome}</span>
            <FaSignOutAlt 
              size={20} 
              style={styles.logoutIcon} 
              onClick={handleLogout} 
              title="Sair"
            />
          </div>
        </div>
      </header>
      {/* === FIM DO NOVO HEADER === */}

      {/* O Outlet renderiza o Dashboard (ou outras páginas) */}
      <main style={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}

// --- ESTILOS PARA O NOVO LAYOUT ---
const styles = {
  pageContainer: {
    backgroundColor: '#f4f7f6', // Fundo cinza bem claro
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#3b5998', // Azul escuro
    color: '#fff',
    padding: '0 40px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
    maxWidth: '1500px', // Limita a largura do conteúdo
    margin: '0 auto', // Centraliza
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  logoImg: {
    width: '30px', // Logo pequeno
    height: '30px',
    marginRight: '10px',
    filter: 'brightness(0) invert(1)', // Deixa o logo branco
  },
  searchBar: {
    position: 'relative',
    flex: 1, // Faz a barra ocupar o espaço
    maxWidth: '600px',
    margin: '0 40px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 15px 10px 40px', // Espaço para o ícone
    borderRadius: '20px',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#555',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userAvatar: {
    color: '#fff',
  },
  userName: {
    fontSize: '16px',
  },
  logoutIcon: {
    cursor: 'pointer',
    opacity: 0.8,
    transition: 'opacity 0.2s',
  },
  mainContent: {
    maxWidth: '1500px',
    margin: '20px auto', // Centraliza e dá espaço do header
    padding: '0 40px',
  },
};

export default App;