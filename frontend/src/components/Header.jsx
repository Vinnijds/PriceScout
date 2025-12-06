// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const styles = {
    header: {
      backgroundColor: '#131A4C',
      padding: isMobile ? '15px 20px' : '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      gap: '12px',
    },
    logoImg: {
      width: isMobile ? '60px' : '80px',
      height: 'auto',
    },
    logoText: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: 'bold',
      color: '#fff',
      margin: 0,
    },
    logoPrice: {
      color: '#fff',
      fontWeight: 'bold'
    },
    logoScout: {
      color: '#7fdb6a',
      fontWeight: '300'
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '15px' : '25px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    userName: {
      color: '#fff',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'opacity 0.3s ease',
    },
    logoutBtn: {
      backgroundColor: 'transparent',
      border: '2px solid #fff',
      color: '#fff',
      padding: isMobile ? '6px 12px' : '8px 16px',
      borderRadius: '6px',
      fontSize: isMobile ? '13px' : '14px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={() => navigate('/dashboard')}>
        <img src="/logo.svg" alt="PriceScout" style={styles.logoImg} />
        <h1 style={styles.logoText}>
          <span style={styles.logoPrice}>Price</span>
          <span style={styles.logoScout}>Scout</span>
        </h1>
      </div>
      
      <nav style={styles.nav}>
        <div style={styles.userInfo}>
          {!isMobile && user && (
            <span 
              style={styles.userName} 
              onClick={() => navigate('/perfil')}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              {user.nome}
            </span>
          )}
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;