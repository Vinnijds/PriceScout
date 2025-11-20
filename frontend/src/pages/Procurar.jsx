// frontend/src/pages/Procurar.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
// Assumindo que você tem um componente grid para mostrar os notebooks
import DisponiveisGrid from '../components/DisponiveisGrid.jsx'; 
import FiltroMonitoramentoModal from '../components/FiltroMonitoramentoModal.jsx'; 
import { useNavigate } from 'react-router-dom'; // Importe o useNavigate

function Procurar() {
  const [notebooksDisponiveis, setNotebooksDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // Busca todos os produtos da rota /products/all
  const fetchDisponiveis = async () => {
    setLoading(true);
    try {
      // Usando a rota que acabamos de criar/confirmar no Backend
      const res = await api.get('/products/all'); 
      setNotebooksDisponiveis(res.data);
    } catch (err) {
      console.error("Erro ao buscar notebooks disponíveis", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisponiveis();
  }, []);

  // Abre o modal de filtro ao clicar em "Monitorar"
  const handleMonitorar = (produto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  // Lógica a ser chamada pelo Modal após "Aplicar Filtro"
  const handleFiltroAplicado = () => {
    setIsModalOpen(false);
    setProdutoSelecionado(null);
    // Redireciona para a Dashboard após monitorar com sucesso
    navigate("/dashboard"); 
  };
  
  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Carregando...</div>;

  return (
    <div style={{padding: '20px'}}>
      <h2 style={{fontSize: '24px', marginBottom: '20px'}}>Notebooks disponíveis para Monitoramento</h2>
      
      {/* Grid de Cards: Deve receber onMonitorar para abrir o modal */}
      <DisponiveisGrid 
        notebooks={notebooksDisponiveis} 
        onMonitorar={handleMonitorar} 
      />
      
      {/* Modal de Filtro (Imagem do pop-up) */}
      <FiltroMonitoramentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        produto={produtoSelecionado}
        onFiltroAplicado={handleFiltroAplicado}
      />
    </div>
  );
}

export default Procurar;