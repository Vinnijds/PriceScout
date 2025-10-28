// src/pages/Register.jsx (VERSÃO FINAL COM NOVO ESTILO)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../services/api'; // Usar o 'api' service

function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repitaSenha, setRepitaSenha] = useState(''); // Novo estado para o campo "Repita sua senha"
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- NOVA VALIDAÇÃO ---
    // 1. Verifica se as senhas são iguais
    if (senha !== repitaSenha) {
      setError('As senhas não conferem.');
      return; // Para a execução
    }
    // --- FIM DA VALIDAÇÃO ---

    try {
      // 2. Chama a API correta (/users/register)
      // O 'nome' é necessário para o backend
      await api.post('/users/register', { nome, email, senha }); 

      // 3. Se deu certo, avisa e redireciona para o Login
      alert('Cadastro realizado com sucesso!');
      navigate('/login');

    } catch (err) {
      // 4. Se deu errado, pega a mensagem de erro da API
      if (err.response && err.response.data.error) {
        setError(err.response.data.error); // Ex: "Este e-mail já está cadastrado."
      } else {
        setError('Erro ao se cadastrar. Tente novamente.');
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* A flecha agora leva de volta para a página de login */}
      <FaArrowLeft style={styles.backArrow} onClick={() => navigate('/')} /> 

      <div style={styles.loginBox}> {/* Reutilizando o estilo do loginBox */}
        <h2 style={styles.title}>Crie sua conta</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* --- CAMPO "NOME" (Necessário para o backend) --- */}
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
          {/* --- FIM DO CAMPO "NOME" --- */}

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
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={styles.input}
          />

          {/* --- CAMPO "REPITA SUA SENHA" (Do novo design) --- */}
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
          {/* --- FIM DO CAMPO --- */}

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

// --- ESTILOS CSS INLINE ---
// (São idênticos aos da tela de Login, para manter a consistência)
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

export default Register;