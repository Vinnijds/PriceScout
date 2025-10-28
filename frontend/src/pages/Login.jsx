// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; // <-- Importa nosso hook

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);

  // Pega a função 'login' de dentro do nosso Contexto
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Chama a API de Login (do backend)
      const response = await api.post('/users/login', { email, senha });

      // 2. A API retornou os dados (token e user)
      const { token, user } = response.data;

      // 3. CHAMA A FUNÇÃO DE LOGIN DO CONTEXTO!
      // Ela vai salvar tudo e nos redirecionar.
      login(token, user); 

      navigate('/');

    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
    <div>
      <h2>Página de Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <label>Senha:</label>
          <input 
            type="password" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required 
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;