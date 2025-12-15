// src/pages/Perfil.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../services/api';

function Perfil() {
  const { user, login } = useAuth();

  // Estados para informações básicas
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagemInfo, setMensagemInfo] = useState('');
  const [erroInfo, setErroInfo] = useState('');

  // Estados para os campos de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);
  const [mensagemSenha, setMensagemSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  // Carrega os dados do usuário ao montar o componente
  useEffect(() => {
    if (user) {
      const nomeCompleto = user.nome || '';
      const primeiroEspaco = nomeCompleto.indexOf(' ');
      
      if (primeiroEspaco > -1) {
        setNome(nomeCompleto.substring(0, primeiroEspaco));
        setSobrenome(nomeCompleto.substring(primeiroEspaco + 1));
      } else {
        setNome(nomeCompleto);
        setSobrenome('');
      }
      
      setEmail(user.email || '');
    }
  }, [user]);

  // Função para salvar informações básicas
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagemInfo('');
    setErroInfo('');

    try {
      const nomeCompleto = `${nome.trim()} ${sobrenome.trim()}`.trim();
      
      const response = await api.put('/perfil', {
        nome: nomeCompleto,
        email: email.trim()
      });

      // Atualiza o contexto de autenticação com os novos dados
      const token = localStorage.getItem('token');
      login(token, response.data.user);

      setMensagemInfo('Informações atualizadas com sucesso!');
      setTimeout(() => setMensagemInfo(''), 3000);
    } catch (error) {
      const mensagem = error.response?.data?.message || 'Erro ao atualizar informações.';
      setErroInfo(mensagem);
      setTimeout(() => setErroInfo(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar senha
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMensagemSenha('');
    setErroSenha('');

    // Validações no frontend
    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      setErroSenha('Todos os campos de senha são obrigatórios.');
      return;
    }

    if (novaSenha !== confirmaSenha) {
      setErroSenha('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (novaSenha.length < 8) {
      setErroSenha('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (!/[0-9]/.test(novaSenha)) {
      setErroSenha('A nova senha deve conter pelo menos um número.');
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(novaSenha)) {
      setErroSenha('A nova senha deve conter pelo menos um caractere especial.');
      return;
    }

    setLoading(true);

    try {
      await api.put('/perfil/senha', {
        senhaAtual,
        novaSenha
      });

      setMensagemSenha('Senha atualizada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmaSenha('');
      setTimeout(() => setMensagemSenha(''), 3000);
    } catch (error) {
      const mensagem = error.response?.data?.message || 'Erro ao atualizar senha.';
      setErroSenha(mensagem);
      setTimeout(() => setErroSenha(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* --- CABEÇALHO DO PERFIL --- */}
      <div style={styles.profileHeader}>
        <img 
          src="https://via.placeholder.com/100"
          alt="Avatar" 
          style={styles.avatar} 
        />
        <span style={styles.profileName}>{nome} {sobrenome}</span>
      </div>

      {/* --- CARD 1: INFORMAÇÕES BÁSICAS --- */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Informações básicas</h2>
        <form onSubmit={handleSaveInfo} style={styles.formGrid}>
          {/* Linha 1 */}
          <div style={styles.formField}>
            <label htmlFor="nome" style={styles.label}>Nome</label>
            <input 
              type="text" 
              id="nome" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formField}>
            <label htmlFor="sobrenome" style={styles.label}>Sobrenome</label>
            <input 
              type="text" 
              id="sobrenome" 
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              style={styles.input}
            />
          </div>
          {/* Linha 2 */}
          <div style={styles.formField}>
            <label htmlFor="email" style={styles.label}>E-mail</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formField}>
            {/* Campo vazio para manter grid */}
          </div>
          
          {/* Mensagens */}
          {mensagemInfo && (
            <div style={{...styles.formField, gridColumn: '1 / -1'}}>
              <div style={styles.successMessage}>{mensagemInfo}</div>
            </div>
          )}
          {erroInfo && (
            <div style={{...styles.formField, gridColumn: '1 / -1'}}>
              <div style={styles.errorMessage}>{erroInfo}</div>
            </div>
          )}
          
          {/* Botão Salvar */}
          <div style={{...styles.formField, gridColumn: '2', textAlign: 'right'}}>
            <button type="submit" style={styles.buttonPrimary} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>

      {/* --- CARD 2: MUDAR SENHA --- */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Mude sua senha</h2>
        <form onSubmit={handleUpdatePassword}>
          <div style={styles.passwordWrapper}>
            <input 
              type={showSenhaAtual ? 'text' : 'password'} 
              placeholder="Inserir senha atual" 
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              style={styles.input} 
            />
            <span style={styles.eyeIcon} onClick={() => setShowSenhaAtual(!showSenhaAtual)}>
              {showSenhaAtual ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          <div style={styles.passwordWrapper}>
            <input 
              type={showNovaSenha ? 'text' : 'password'} 
              placeholder="Inserir nova senha" 
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={styles.input} 
            />
            <span style={styles.eyeIcon} onClick={() => setShowNovaSenha(!showNovaSenha)}>
              {showNovaSenha ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div style={styles.passwordWrapper}>
            <input 
              type={showConfirma ? 'text' : 'password'} 
              placeholder="Confirmar nova senha" 
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              style={styles.input} 
            />
            <span style={styles.eyeIcon} onClick={() => setShowConfirma(!showConfirma)}>
              {showConfirma ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div style={styles.requisitos}>
            <p>Por favor, siga este guia para uma senha forte:</p>
            <ul>
              <li>Pelo menos um caractere especial</li>
              <li>Pelo menos 8 caracteres</li>
              <li>Pelo menos um número (recomendamos dois)</li>
              <li>Altere-a com frequência</li>
            </ul>
          </div>
          
          {/* Mensagens */}
          {mensagemSenha && <div style={styles.successMessage}>{mensagemSenha}</div>}
          {erroSenha && <div style={styles.errorMessage}>{erroSenha}</div>}
          
          <div style={{textAlign: 'right'}}>
            <button type="submit" style={styles.buttonPrimary} disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar senha'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

// --- ESTILOS CSS INLINE ---
const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '20px 0',
    fontFamily: 'Arial, sans-serif',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginRight: '20px',
    objectFit: 'cover',
  },
  profileName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '30px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '25px',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '8px',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    backgroundColor: '#fff',
    width: '100%',
    boxSizing: 'border-box',
  },
  buttonPrimary: {
    padding: '12px 25px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b5998',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: '15px',
  },
  eyeIcon: {
    position: 'absolute',
    top: '50%',
    right: '15px',
    transform: 'translateY(-50%)',
    color: '#777',
    cursor: 'pointer',
  },
  requisitos: {
    fontSize: '14px',
    color: '#666',
    marginTop: '20px',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px 15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #c3e6cb',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px 15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #f5c6cb',
  },
};

export default Perfil;