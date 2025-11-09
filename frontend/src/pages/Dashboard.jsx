// src/pages/Dashboard.jsx (VERSÃO ATUALIZADA COM 3 COLUNAS)
import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { useAuth } from '../context/AuthContext';
// Importa os componentes da página
import LojasMonitoradas from '../components/LojasMonitoradas';
import MonitoradosGrid from '../components/MonitoradosGrid'; // <-- Nosso novo componente
// Importa ícones
import { FaExchangeAlt } from 'react-icons/fa'; // Ícone de "Comparar"

// --- FUNÇÕES AUXILIARES (movemos para fora do componente) ---
function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 'N/D';
  }
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function getMelhorOferta(ofertas) {
  if (!ofertas || ofertas.length === 0) {
    return { preco_atual: null, loja: 'N/A', url: '#' };
  }
  return ofertas.reduce((melhor, atual) => {
    if (atual.preco_atual < melhor.preco_atual) {
      return atual;
    }
    return melhor;
  });
}
// --- FIM DAS FUNÇÕES AUXILIARES ---


function Dashboard() {
  const { user } = useAuth();
  const [produtosSeguidos, setProdutosSeguidos] = useState([]);
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lógica de busca de dados (idêntica)
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const seguidosResponse = await api.get('/dashboard');
      setProdutosSeguidos(seguidosResponse.data);
      const todosResponse = await api.get('/products');
      setTodosProdutos(todosResponse.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lógica de "Seguir" (idêntica, agora também edita o preço)
  const handleFollow = async (produtoId) => {
    const preco = prompt("Qual o seu preço-alvo para este produto? (Deixe em branco se não tiver)");
    if (preco === null) return;
    const precoDesejado = parseFloat(preco) || null;
    try {
      await api.post(`/products/${produtoId}/follow`, { precoDesejado });
      alert('Produto monitorado/preço atualizado!');
      fetchData(); // Atualiza a lista
    } catch (err) {
      alert('Erro ao seguir produto.');
    }
  };

  // Lógica de "Deixar de Seguir" (idêntica)
  const handleUnfollow = async (produtoId) => {
    if (!confirm("Tem certeza que quer deixar de seguir este produto?")) {
      return;
    }
    try {
      await api.delete(`/products/${produtoId}/follow`);
      alert('Você deixou de seguir o produto.');
      fetchData(); // Atualiza a lista
    } catch (err) {
      alert('Erro ao deixar de seguir.');
    }
  };

  if (loading) return <div style={styles.loading}>Carregando dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Filtra os produtos que o usuário ainda NÃO segue
  const produtosNaoSeguidos = todosProdutos.filter(p => 
    !produtosSeguidos.some(s => s.id === p.id)
  );

  return (
    // O layout principal do dashboard (3 colunas)
    <div style={styles.dashboardContainer}>
      
      {/* === COLUNA ESQUERDA (NAV) === */}
      <div style={styles.leftNavColumn}>
        {/* Como você pediu, removi o "Procurar" e deixei só este */}
        <div style={styles.navCard}>
          <FaExchangeAlt size={20} color="#555" />
          <span style={styles.navTitle}>Comparar Notebooks</span>
        </div>
        {/* Você pode adicionar mais botões aqui se quiser */}
      </div>

      {/* === COLUNA PRINCIPAL (CENTRO) === */}
      <div style={styles.mainColumn}>
        
        {/* --- 1. Grid de Notebooks Monitorados (NOVO) --- */}
        <MonitoradosGrid 
          produtos={produtosSeguidos}
          onUnfollow={handleUnfollow}
          onEditPrice={handleFollow} // A função "seguir" também edita o preço
        />

        {/* --- 2. Tabela de Melhores Ofertas (ATUALIZADA) --- */}
        <div style={styles.card}>
          <h3 style={styles.title}>Melhores Ofertas Atuais</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Produto</th>
                <th style={styles.th}>Melhor Preço</th>
                <th style={styles.th}>Loja</th>
                <th style={styles.th}>Preço Alvo</th>
                {/* Removemos a coluna "Ação", pois as ações estão no grid */}
              </tr>
            </thead>
            <tbody>
              {produtosSeguidos.length === 0 ? (
                <tr>
                  <td colSpan="4" style={styles.emptyCell}>Você ainda não segue nenhum produto.</td>
                </tr>
              ) : (
                produtosSeguidos.map(produto => {
                  const melhorOferta = getMelhorOferta(produto.ofertas);
                  return (
                    <tr key={produto.id}>
                      <td style={styles.td}>
                        <a href={melhorOferta.url || '#'} target="_blank" rel="noopener noreferrer" style={styles.productLink}>
                          {produto.nome_produto}
                        </a>
                      </td>
                      <td style={styles.td}>{formatCurrency(melhorOferta.preco_atual)}</td>
                      <td style={styles.td}>{melhorOferta.loja}</td>
                      <td style={styles.td}>{formatCurrency(produto.preco_desejado)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* --- 3. Lista de Produtos para Descobrir (MANTIDA) --- */}
        {/* Mantive esta seção para que você possa adicionar novos produtos */}
        <div style={styles.card}>
          <h3 style={styles.title}>Disponível para Monitorar</h3>
          <div style={styles.discoverList}>
            {produtosNaoSeguidos.length === 0 ? (
              <p>Você já segue todos os produtos!</p>
            ) : (
              produtosNaoSeguidos.map(produto => (
                <div key={produto.id} style={styles.discoverItem}>
                  <div>
                    <span style={styles.discoverTitle}>{produto.nome_produto}</span>
                    <span style={styles.discoverSpecs}>
                      {produto.cpu_base} | {produto.ram_base} | {produto.armazenamento_base}
                    </span>
                  </div>
                  <button onClick={() => handleFollow(produto.id)} style={styles.followBtn}>
                    + Monitorar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* === COLUNA DA BARRA LATERAL (DIREITA) === */}
      <div style={styles.sidebarColumn}>
        {/* <AlertasRecentes /> */} {/* Ainda comentado, como pedindo */}
        <LojasMonitoradas />
      </div>

    </div>
  );
}

// --- ESTILOS PARA O DASHBOARD (3 COLUNAS) ---
const styles = {
  dashboardContainer: {
    display: 'grid',
    // Define as 3 colunas: Esquerda (fixa), Centro (flexível), Direita (fixa)
    gridTemplateColumns: '240px 1fr 350px', 
    gap: '20px',
    alignItems: 'flex-start',
  },
  leftNavColumn: {
    position: 'sticky', // Fica presa ao rolar
    top: '90px', // Distância do header
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
  // Card da Nav Esquerda
  navCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  navTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  // Loading
  loading: {
    fontSize: '20px',
    color: '#555',
    textAlign: 'center',
    padding: '50px',
  },
  // Card Genérico
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
  // Tabela
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 15px',
    borderBottom: '2px solid #f0f2f5',
    color: '#999',
    fontSize: '12px',
    textTransform: 'uppercase',
  },
  td: {
    textAlign: 'left',
    padding: '15px',
    borderBottom: '1px solid #f0f2f5',
    color: '#333',
    fontSize: '14px',
  },
  emptyCell: {
    textAlign: 'center',
    padding: '30px',
    color: '#999',
  },
  productLink: {
    color: '#3b5998',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  // Lista de "Descobrir" (Estilos do design anterior)
  discoverList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  discoverItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  discoverTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    display: 'block',
  },
  discoverSpecs: {
    fontSize: '12px',
    color: '#777',
  },
  followBtn: {
    backgroundColor: '#3b5998',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  }
};

export default Dashboard;