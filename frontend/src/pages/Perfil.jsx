// src/pages/Perfil.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Ícones de olho

function Perfil() {
  const { user } = useAuth(); // Pega o usuário logado do contexto

  // Divide o nome em "Nome" e "Sobrenome" (baseado no primeiro espaço)
  const nomeCompleto = user ? user.nome : 'Usuário';
  const primeiroEspaco = nomeCompleto.indexOf(' ');
  const nome = primeiroEspaco > -1 ? nomeCompleto.substring(0, primeiroEspaco) : nomeCompleto;
  const sobrenome = primeiroEspaco > -1 ? nomeCompleto.substring(primeiroEspaco + 1) : '';

  // Estados para os campos de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);

  // Funções (ainda não implementadas, apenas visuais)
  const handleSaveInfo = (e) => {
    e.preventDefault();
    alert('Funcionalidade de salvar informações básicas ainda não implementada.');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    // Lógica para verificar e atualizar a senha (próximo passo)
    alert('Funcionalidade de atualizar senha ainda não implementada.');
  };

  return (
    <div style={styles.container}>
      
      {/* --- CABEÇALHO DO PERFIL --- */}
      <div style={styles.profileHeader}>
        <img 
          src="https://via.placeholder.com/100" // Placeholder para o avatar
          alt="Avatar" 
          style={styles.avatar} 
        />
        <span style={styles.profileName}>{nomeCompleto}</span>
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
              style={styles.input} 
              disabled // Desabilitado por enquanto
            />
          </div>
          <div style={styles.formField}>
            <label htmlFor="sobrenome" style={styles.label}>Sobrenome</label>
            <input 
              type="text" 
              id="sobrenome" 
              value={sobrenome} 
              style={styles.input} 
              disabled // Desabilitado por enquanto
            />
          </div>
          {/* Linha 2 */}
          <div style={styles.formField}>
            <label htmlFor="email" style={styles.label}>E-mail</label>
            <input 
              type="email" 
              id="email" 
              value={user ? user.email : ''} 
              style={styles.input} 
              disabled 
            />
          </div>
          <div style={styles.formField}>
            <label htmlFor="aniversario" style={styles.label}>Data de aniversário</label>
            <input 
              type="text" 
              id="aniversario" 
              value="02/02/02" // Placeholder
              style={styles.input} 
              disabled 
            />
          </div>
          {/* Botão Salvar */}
          <div style={{...styles.formField, gridColumn: '2', textAlign: 'right'}}>
            <button type="submit" style={styles.buttonPrimary}>Salvar</button>
          </div>
        </form>
      </div>

      {/* --- CARD 2: MUDAR SENHA --- */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Mude sua senha</h2>
        <form onSubmit={handleUpdatePassword}>
          <div style={{...styles.formField, marginBottom: '15px'}}>
            <input 
              type="password" 
              placeholder="Inserir senha atual" 
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              style={styles.input} 
            />
          </div>
          
          <div style={styles.passwordWrapper}>
            <input 
              type={showSenha ? 'text' : 'password'} 
              placeholder="Inserir nova senha" 
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={styles.input} 
            />
            <span style={styles.eyeIcon} onClick={() => setShowSenha(!showSenha)}>
              {showSenha ? <FaEyeSlash /> : <FaEye />}
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
          
          <div style={{textAlign: 'right'}}>
            <button type="submit" style={styles.buttonPrimary}>Atualizar senha</button>
          </div>
        </form>
      </div>

    </div>
  );
}

// --- ESTILOS CSS INLINE ---
const styles = {
  container: {
    maxWidth: '700px', // Largura do conteúdo central
    margin: '0 auto', // Centraliza na página
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
    backgroundColor: '#f7f7f7',
    width: '100%',
    boxSizing: 'border-box', // Garante que o padding não quebre o layout
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
};

export default Perfil;