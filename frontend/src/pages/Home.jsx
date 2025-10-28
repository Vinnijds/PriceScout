// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        
        {/* Logo (puxando de /public/logo.png) */}
        <img src="/logo.png" alt="PriceScout Logo" style={styles.logo} />

        <h1 style={styles.title}>
          Monitore preços com o PriceScout
        </h1>
        
        <p style={styles.subtitle}>
          Receba alertas quando seus produtos favoritos baixarem de preço. 
          Nós fazemos o trabalho pesado por você.
        </p>

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

// --- ESTILOS CSS INLINE ---
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
  },
  content: {
    maxWidth: '500px',
    width: '100%',
  },
  logo: {
    width: '150px', // Ajuste o tamanho do logo conforme necessário
    height: 'auto',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '40px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  btnPrimary: {
    padding: '12px 25px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b5998', // Cor azul escuro
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  btnSecondary: {
    padding: '12px 25px',
    borderRadius: '8px',
    border: '2px solid #3b5998', // Borda azul
    backgroundColor: '#fff', // Fundo branco
    color: '#3b5998', // Texto azul
    fontSize: '18px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  }
};

export default Home;