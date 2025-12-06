// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#131A4C',
      fontFamily: "'Arial', sans-serif",
      textAlign: 'center',
      padding: isMobile ? '15px' : '20px', 
      position: 'relative',
      overflow: 'hidden',
    },
    // Logo 1 - Superior Esquerda
    bgLogo1: {
      position: 'absolute',
      top: isMobile ? '-10%' : '-5%',
      left: isMobile ? '-20%' : '-12%',
      width: isSmallMobile ? '180px' : isMobile ? '220px' : '450px',
      opacity: 0.10,
      filter: 'blur(4px)',
      transform: 'rotate(10deg)',
      zIndex: 1,
    },
    // Logo 2 - Superior Direita
    bgLogo2: {
      position: 'absolute',
      top: isMobile ? '-18%' : '-15%',
      right: isMobile ? '10%' : '15%',
      width: isSmallMobile ? '160px' : isMobile ? '200px' : '400px',
      opacity: 0.10,
      filter: 'blur(4px)',
      transform: 'rotate(-18deg)',
      zIndex: 1,
    },
    // Logo 3 - Inferior Esquerda
    bgLogo3: {
      position: 'absolute',
      bottom: isMobile ? '-12%' : '-8%',
      left: isMobile ? '-5%' : '1%',
      width: isSmallMobile ? '200px' : isMobile ? '250px' : '550px',
      opacity: 0.10,
      filter: 'blur(4px)',
      transform: 'rotate(-18deg)',
      zIndex: 1,
    },
    // Logo 4 - Inferior Direita
    bgLogo4: {
      position: 'absolute',
      bottom: isMobile ? '8%' : '12%',
      right: isMobile ? '-15%' : '-10%',
      width: isSmallMobile ? '220px' : isMobile ? '280px' : '600px',
      opacity: 0.10,
      filter: 'blur(4px)',
      transform: 'rotate(-20deg)',
      zIndex: 1,
    },
    content: {
      maxWidth: isMobile ? '100%' : '500px',
      width: '100%',
      zIndex: 2,
      position: 'relative',
    },
    logo: {
      width: isSmallMobile ? '200px' : isMobile ? '250px' : '320px',
      height: 'auto',
      marginBottom: '5px',
      marginLeft: isMobile ? '0' : '-50px',
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
    },
    title: {
      fontSize: isSmallMobile ? '32px' : isMobile ? '36px' : '48px',
      letterSpacing: '1px',
      margin: 0,
    },
    titlePrice: {
      color: '#ffffff', 
      fontWeight: 'bold', 
    },
    titleScout: {
      color: '#7fdb6a',  
      fontWeight: '300', 
    },
    subtitle: {
      fontSize: isSmallMobile ? '16px' : isMobile ? '18px' : '25px',
      color: '#ffffff',
      fontWeight: 'bold',
      lineHeight: '1.5',
      marginBottom: isSmallMobile ? '30px' : '50px',
      padding: isMobile ? '0 10px' : '0',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      alignItems: 'center',
      width: '100%',
      padding: isMobile ? '0 20px' : '0',
    },
    btnPrimary: {
      width: '100%',
      maxWidth: isMobile ? '100%' : '380px',
      padding: isSmallMobile ? '10px 20px' : isMobile ? '11px 25px' : '14px 40px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#ffffff',
      color: '#1e3a5f',
      fontSize: isMobile ? '16px' : '18px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
    btnSecondary: {
      width: '100%',
      maxWidth: isMobile ? '100%' : '380px',
      padding: isSmallMobile ? '10px 20px' : isMobile ? '11px 25px' : '14px 30px',
      borderRadius: '8px',
      border: '2px solid #ffffff',
      backgroundColor: 'transparent',
      color: '#ffffff',
      fontSize: isMobile ? '16px' : '18px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    }
  };

  return (
    <div style={styles.container}>
      {/* Background com logos desfocadas e rotacionadas */}
      <img src="/logo.svg" style={styles.bgLogo1} alt="" />
      <img src="/logo.svg" style={styles.bgLogo2} alt="" />
      <img src="/logo.svg" style={styles.bgLogo3} alt="" />
      <img src="/logo.svg" style={styles.bgLogo4} alt="" />
      
      <div style={styles.content}>
        
        {/* Logo */}
        <img src="/logo.svg" alt="PriceScout Logo" style={styles.logo} />

        {/* Título PriceScout */}
        <h1 style={styles.title}>
          <span style={styles.titlePrice}>Price</span>
          <span style={styles.titleScout}>Scout</span>
        </h1>
        
        {/* Subtítulo */}
        <p style={styles.subtitle}>
          Monitore preços com o PriceScout
        </p>

        {/* Botões */}
        <div style={styles.buttonContainer}>
          <button 
            style={styles.btnPrimary} 
            onClick={() => navigate('/register')}
          >
            Cadastre-se
          </button>
          <button 
            style={styles.btnSecondary} 
            onClick={() => navigate('/login')}
          >
            Entrar
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Home;