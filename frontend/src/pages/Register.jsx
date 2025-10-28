// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Nosso serviço Axios

function Register() {
  // 'useNavigate' é um "hook" do router para nos deixar mudar de página
  const navigate = useNavigate(); 

  // 'useState' armazena os dados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null); // Para mensagens de erro

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento padrão do form
    setError(null);     // Limpa erros antigos

    try {
      // 1. Chama a API do backend
      await api.post('/users/register', { nome, email, senha });

      // 2. Se deu certo, avisa e redireciona para o Login
      alert('Cadastro realizado com sucesso!');
      navigate('/login');

    } catch (err) {
      // 3. Se deu errado, pega a mensagem de erro da API
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao se cadastrar. Tente novamente.');
      }
    }
  };

  return (
    <div>
      <h2>Página de Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            required 
          />
        </div>
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

        {/* Exibe a mensagem de erro, se houver */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Register;