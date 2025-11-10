import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// import AlertasRecentes from './AlertasRecentes'; // Mantenha comentado se ainda não criou
import LojasMonitoradas from './LojasMonitoradas';
import { FaSearch, FaExchangeAlt } from 'react-icons/fa';

// Este componente cria o layout de 3 colunas
function MainLayout() {
  const navigate = useNavigate();

  return (
    <div style={styles.dashboardContainer}>
      
      {/* === COLUNA ESQUERDA (NAV) === */}
      <div style={styles.leftNavColumn}>
        <div style={styles.navCard} onClick={() => navigate('/dashboard')}>
          <FaSearch size={20} color="#555" />
          <span style={styles.navTitle}>Procurar Notebooks</span>
        </div>
        <div style={styles.navCard} onClick={() => navigate('/comparar')}>
          <FaExchangeAlt size={20} color="#555" />
          <span style={styles.navTitle}>Comparar Notebooks</span>
        </div>
      </div>

      {/* === COLUNA PRINCIPAL (CENTRO) === */}
      <div style={styles.mainColumn}>
        {/* O <Outlet> renderizará o Dashboard ou a página Comparar */}
        <Outlet />
      </div>

      {/* === COLUNA DA BARRA LATERAL (DIREITA) === */}
      <div style={styles.sidebarColumn}>
        {/* <AlertasRecentes /> */} 
        <LojasMonitoradas />
      </div>

    </div>
  );
}

// Estilos
const styles = {
  dashboardContainer: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr 350px', 
    gap: '20px',
    alignItems: 'flex-start',
  },
  leftNavColumn: {
    position: 'sticky',
    top: '90px', 
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sidebarColumn: {
    position: 'sticky',
    top: '90px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  navCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.2s',
  },
  navTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default MainLayout;