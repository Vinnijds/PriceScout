import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MonitoradosGrid from '../components/MonitoradosGrid.jsx';
import { FaSync } from 'react-icons/fa'; // Ícone de refresh

// --- Componente do Formulário (Novo) ---
function AddProductForm({ onProductAdded }) {
  const [nome, setNome] = useState('');
  const [termo, setTermo] = useState('');
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('');
  const [armazenamento, setArmazenamento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !termo) {
      alert("Nome do Produto e Termo de Busca são obrigatórios.");
      return;
    }
    try {
      await api.post('/products/add', {
        nome_produto: nome,
        termo_busca: termo,
        cpu_base: cpu,
        ram_base: ram,
        armazenamento_base: armazenamento
      });
      alert('Notebook adicionado e monitorado!');
      // Limpa o formulário e atualiza a lista no Dashboard
      setNome(''); setTermo(''); setCpu(''); setRam(''); setArmazenamento('');
      onProductAdded(); 
    } catch (err) {
      alert('Erro ao adicionar produto.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formGrid}>
      <input style={styles.input} value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome (Ex: Dell G15)" />
      <input style={styles.input} value={termo} onChange={e => setTermo(e.target.value)} placeholder="Termo de Busca (Ex: notebook dell g15)" />
      <input style={styles.input} value={cpu} onChange={e => setCpu(e.target.value)} placeholder="CPU Base (Ex: Core i7)" />
      <input style={styles.input} value={ram} onChange={e => setRam(e.target.value)} placeholder="RAM Base (Ex: 16GB)" />
      <input style={styles.input} value={armazenamento} onChange={e => setArmazenamento(e.target.value)} placeholder="Armazenamento (Ex: 512GB SSD)" />
      <button type="submit" style={styles.addBtnFull}>+ Adicionar e Monitorar</button>
    </form>
  );
}
// --- Fim do Componente do Formulário ---

// Funções auxiliares (Formatar Moeda, Melhor Oferta)
function formatCurrency(value) { /* ... (código mantido) ... */ 
  if (value === null || value === undefined || isNaN(Number(value))) return 'N/D';
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function getMelhorOferta(ofertas) { /* ... (código mantido) ... */ 
  if (!ofertas || ofertas.length === 0) return { preco_atual: null, loja: 'N/A', url: '#' };
  // Ordena por preço (já vem ordenado do backend, mas garantimos)
  const sortedOfertas = [...ofertas].sort((a, b) => a.preco_atual - b.preco_atual);
  return sortedOfertas[0];
}

// --- Componente Principal do Dashboard ---
function Dashboard() {
  const [produtosSeguidos, setProdutosSeguidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // Estado para o botão de atualizar

  // Busca apenas os produtos que o usuário segue
  const fetchData = async () => {
    setLoading(true);
    try {
      const seguidosRes = await api.get('/dashboard');
      setProdutosSeguidos(seguidosRes.data);
    } catch (err) {
      console.error("Erro ao buscar dados", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Função para chamar o Scraper
  const handleUpdatePrices = async () => {
    setUpdating(true);
    try {
      const res = await api.post('/api/run-scraper');
      alert(res.data.message || "Varredura concluída!"); 
      fetchData(); // Recarrega os dados da tela
    } catch (err) {
      alert("Erro ao atualizar preços. Veja o console do backend.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Funções para seguir/parar de seguir (necessário para o Grid)
  const handleEditPrice = async (produtoId) => {
    // Pega o preço atual
    const produto = produtosSeguidos.find(p => p.id === produtoId);
    const precoAtual = produto.preco_desejado ? `(Atual: ${formatCurrency(produto.preco_desejado)})` : '';

    const preco = prompt(`Qual o seu novo preço-alvo? ${precoAtual}\n(Deixe em branco para remover)`);
    if (preco === null) return;
    try {
      await api.post(`/products/${produtoId}/follow`, { precoDesejado: parseFloat(preco) || null });
      fetchData(); // Atualiza a lista
    } catch (e) { alert('Erro ao editar preço.'); }
  };

  const handleUnfollow = async (produtoId) => {
    if(!confirm("Tem certeza que quer deixar de seguir este produto?")) return;
    try {
      await api.delete(`/products/${produtoId}/follow`);
      fetchData(); // Atualiza a lista (produto sairá daqui)
    } catch (e) { alert('Erro ao deixar de seguir.'); }
  };

  if (loading && !produtosSeguidos.length) return <div style={styles.loading}>Carregando...</div>;

  return (
    <>
      {/* Botão de Atualizar Preços */}
      <div style={styles.headerAction}>
        <h2 style={styles.pageTitle}>Meus Monitoramentos</h2>
        <button 
          onClick={handleUpdatePrices} 
          disabled={updating}
          style={{...styles.updateBtn, opacity: updating ? 0.7 : 1}}
        >
          <FaSync className={updating ? "spin" : ""} style={{marginRight: 8}} />
          {updating ? "Atualizando..." : "Atualizar Preços Agora"}
        </button>
      </div>

      {/* Seção 1: Grid de Produtos Seguidos */}
      <MonitoradosGrid 
        produtos={produtosSeguidos} 
        onUnfollow={handleUnfollow} 
        onEditPrice={handleEditPrice} 
      />

      {/* Seção 2: Tabela de Melhores Ofertas */}
      <div style={styles.section}>
        <h3 style={styles.title}>Resumo de Preços</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Produto</th>
              <th style={styles.th}>Melhor Preço Atual</th>
              <th style={styles.th}>Loja</th>
              <th style={styles.th}>Sua Meta</th>
            </tr>
          </thead>
          <tbody>
            {produtosSeguidos.length === 0 ? (
                <tr><td colSpan="4" style={styles.tdCenter}>Você ainda não monitora nenhum produto. Adicione um abaixo!</td></tr>
            ) : produtosSeguidos.map(p => {
              const oferta = getMelhorOferta(p.ofertas);
              return (
                <tr key={p.id}>
                  <td style={styles.td}>{p.nome_produto}</td>
                  <td style={styles.td}>
                    <a href={oferta.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      {formatCurrency(oferta.preco_atual)}
                    </a>
                  </td>
                  <td style={styles.td}>{oferta.loja}</td>
                  <td style={styles.td}>{formatCurrency(p.preco_desejado)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Seção 3: Formulário para Adicionar Novos Produtos */}
      <div style={styles.section}>
        <h3 style={styles.title}>Adicionar Novo Notebook para Monitorar</h3>
        <AddProductForm onProductAdded={fetchData} />
      </div>
      
      {/* Estilo para girar o ícone de refresh */}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

// --- Estilos ---
const styles = {
  loading: { padding: 50, textAlign: 'center', color: '#666', fontSize: 18 },
  headerAction: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pageTitle: { fontSize: 24, color: '#333', margin: 0 },
  updateBtn: { 
    backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', 
    borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: 14,
    transition: 'background-color 0.2s'
  },
  section: { backgroundColor: 'white', padding: 25, borderRadius: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginTop: 20 },
  title: { fontSize: 18, marginBottom: 15, color: '#333', borderBottom: '1px solid #eee', paddingBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: 12, borderBottom: '2px solid #eee', color: '#888', fontSize: 12, textTransform: 'uppercase' },
  td: { padding: 12, borderBottom: '1px solid #f5f5f5', fontSize: 14 },
  tdCenter: { padding: 20, textAlign: 'center', color: '#999' },
  link: { color: '#3b5998', textDecoration: 'none', fontWeight: 'bold' },
  // Estilos do Formulário
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: '#f9f9f9',
  },
  addBtnFull: {
    gridColumn: '1 / -1', // Ocupa as duas colunas
    backgroundColor: '#3b5998',
    color: 'white',
    border: 'none',
    padding: '12px 15px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 'bold'
  }
};

export default Dashboard;