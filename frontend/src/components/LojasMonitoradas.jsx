// src/components/LojasMonitoradas.jsx
// ESTE É O CÓDIGO LIMPO E CORRETO

import React from 'react';
import { FaAmazon } from 'react-icons/fa';
import { SiMercadopago} from 'react-icons/si'; // MercadoLivre e Magalu

// Componente estático (visual)
function LojasMonitoradas() {
  const lojas = [
    { nome: 'Americanas', pais: 'Brasil', icon: <span style={styles.logoText}>A</span>, color: '#E60014' },
    { nome: 'Amazon', pais: 'Brasil', icon: <FaAmazon />, color: '#FF9900' },
    { nome: 'Mercado Livre', pais: 'Brasil', icon: <SiMercadopago />, color: '#FFE600' },
    { nome: 'Kabum', pais: 'Brasil', icon: <span style={styles.logoText}>K</span>, color: '#FF6600' },
    { nome: 'Magalu', pais: 'Brasil', icon: <span style={styles.logoText}>M</span>, color: '#0086FF' },
  ];

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Lojas Monitoradas</h3>
      <ul style={styles.list}>
        {lojas.map((loja, index) => (
          <li key={index} style={styles.listItem}>
            <div style={{...styles.iconWrapper, backgroundColor: loja.color}}>
              {loja.icon}
            </div>
            <div style={styles.textWrapper}>
              <span style={styles.lojaNome}>{loja.nome}</span>
              <span style={styles.lojaPais}>{loja.pais}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Estilos
const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  iconWrapper: {
    marginRight: '15px',
    fontSize: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: '22px',
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  lojaNome: {
    fontSize: '16px',
    color: '#333',
    fontWeight: 'bold',
  },
  lojaPais: {
    fontSize: '12px',
    color: '#999',
  },
};

export default LojasMonitoradas;