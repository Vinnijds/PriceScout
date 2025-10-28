// src/pages/Login.jsx (VERSÃO FINAL CORRIGIDA)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../services/api'; // <-- CORREÇÃO 1: Usar 'api' service
import { useAuth } from '../context/AuthContext'; // <-- CORREÇÃO 2: Usar o Contexto de Autenticação

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState(''); // <-- CORREÇÃO 3: Usar 'senha' (como no backend)
  const [error, setError] = useState(null); // <-- CORREÇÃO 4: Usar 'error'
  
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- CORREÇÃO 5: Pegar a função 'login' do contexto

  // CORREÇÃO 6: Esta é a função handleSubmit que FUNCIONA
  const handleSubmit = async (e) => { 
    e.preventDefault();
    setError(null);

    try {
      // Chama a API correta (/users/login)
      const response = await api.post('/users/login', { email, senha }); 

      const { token, user } = response.data;

      // Chama a função de login do contexto (ela salva o token)
      login(token, user); 
      
      // --- CORREÇÃO AQUI ---
      // Redireciona para a página correta
      navigate('/dashboard'); 

    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error); // Exibe o erro da API (ex: "E-mail ou senha inválidos.")
      } else {
        setError('Erro ao fazer login. Tente novamente.'); // Mensagem genérica
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* A flecha agora leva para a página de registro */}
      <FaArrowLeft style={styles.backArrow} onClick={() => navigate('/')} /> 

      <div style={styles.loginBox}>
        <h2 style={styles.title}>Entre na sua conta</h2>

        {/* CORREÇÃO 7: Usar 'handleSubmit' */}
        <form onSubmit={handleSubmit} style={styles.form}>
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

          <label htmlFor="password" style={styles.label}>Senha</label>
          <input
            type="password"
            id="password"
            placeholder="Digite sua senha"
            value={senha} // <-- CORREÇÃO 8: 'senha'
            onChange={(e) => setSenha(e.target.value)} // <-- CORREÇÃO 9: 'setSenha'
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Entrar</button>
        </form>

        <p style={styles.separator}>- OU -</p>

        <p style={styles.signupText}>
          Não possui uma conta? <span style={styles.signupLink} onClick={() => navigate('/register')}>Cadastre-se</span>
        </p>
        
        {/* CORREÇÃO 10: Exibir o estado 'error' */}
        {error && <p style={styles.message}>{error}</p>}
      </div>
    </div>
  );
}

// --- ESTILOS CSS INLINE (Idênticos ao anterior) ---
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', 
    backgroundColor: '#f0f2f5', 
    fontFamily: 'Arial, sans-serif',
    position: 'relative', 
  },
  backArrow: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '24px',
    color: '#333',
    cursor: 'pointer',
  },
  loginBox: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px', 
  },
  title: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px', 
    marginBottom: '20px',
  },
  label: {
    textAlign: 'left',
    fontSize: '14px',
    color: '#555',
    marginBottom: '-10px', 
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    width: 'calc(100% - 30px)', 
    backgroundColor: '#f7f7f7', 
  },
  button: {
    padding: '12px 25px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b5998', 
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  separator: {
    color: '#aaa',
    margin: '20px 0',
  },
  signupText: {
    fontSize: '15px',
    color: '#555',
  },
  signupLink: {
    color: '#3b5998', 
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  message: { // Este é o estilo para a mensagem de erro
    marginTop: '20px',
    color: 'red',
    fontSize: '14px',
  },
};

export default Login;