// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';

function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repitaSenha, setRepitaSenha] = useState('');
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (senha !== repitaSenha) {
      setError('As senhas não conferem.');
      return;
    }

    try {
      await api.post('/users/register', { nome, email, senha }); 
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao se cadastrar. Tente novamente.');
      }
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#fff',
      fontFamily: "'Arial', sans-serif",
      padding: isMobile ? '15px' : '20px',
      position: 'relative',
    },
    backArrow: {
      position: 'absolute',
      top: isMobile ? '15px' : '20px',
      left: isMobile ? '15px' : '20px',
      fontSize: isMobile ? '20px' : '24px',
      color: '#131A4C',
      cursor: 'pointer',
      zIndex: 10,
    },
    content: {
      width: '100%',
      maxWidth: isMobile ? '100%' : '420px',
      textAlign: 'center',
    },
    title: {
      fontSize: isSmallMobile ? '22px' : isMobile ? '24px' : '28px',
      color: '#131A4C',
      marginBottom: isSmallMobile ? '30px' : '40px',
      fontWeight: 'bold',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      marginBottom: '25px',
    },
    label: {
      textAlign: 'left',
      fontSize: isMobile ? '13px' : '14px',
      color: '#131A4C',
      marginBottom: '5px',
      fontWeight: '600',
      display: 'block',
    },
    input: {
      padding: isMobile ? '12px 15px' : '14px 18px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      fontSize: isMobile ? '15px' : '16px',
      width: '100%',
      backgroundColor: '#f5f5f5',
      boxSizing: 'border-box',
      outline: 'none',
    },
    button: {
      padding: isSmallMobile ? '10px 15px' : isMobile ? '11px 20px' : '12px 25px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#131A4C',
      color: '#fff',
      fontSize: isMobile ? '16px' : '18px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      width: '100%',
      marginTop: '5px',
    },
    separator: {
      color: '#aaa',
      margin: '25px 0',
      fontSize: isMobile ? '13px' : '14px',
    },
    signupText: {
      fontSize: isMobile ? '14px' : '15px',
      color: '#555',
    },
    signupLink: {
      color: '#131A4C',
      fontWeight: 'bold',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    message: {
      marginTop: '20px',
      color: 'red',
      fontSize: isMobile ? '13px' : '14px',
    },
  };

  return (
    <div style={styles.container}>
      <FaArrowLeft style={styles.backArrow} onClick={() => navigate('/')} />

      <div style={styles.content}>
        <h2 style={styles.title}>Crie sua conta</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label htmlFor="nome" style={styles.label}>Nome</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div>
            <label htmlFor="email" style={styles.label}>E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div>
            <label htmlFor="password" style={styles.label}>Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div>
            <label htmlFor="repitaSenha" style={styles.label}>Repita sua senha</label>
            <input
              type="password"
              id="repitaSenha"
              placeholder="Repita sua senha"
              value={repitaSenha}
              onChange={(e) => setRepitaSenha(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>Cadastrar</button>
        </form>

        <p style={styles.separator}>- OU -</p>

        <p style={styles.signupText}>
          Já possui uma conta? <span style={styles.signupLink} onClick={() => navigate('/login')}>Entrar</span>
        </p>
        
        {error && <p style={styles.message}>{error}</p>}
      </div>
    </div>
  );
}

export default Register;