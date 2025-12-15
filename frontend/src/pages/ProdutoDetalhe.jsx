// src/pages/ProdutoDetalhe.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaAmazon, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import { SiMercadopago } from 'react-icons/si';

const placeholderImg = "https://placehold.co/400x300/png?text=Notebook";

function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutoDetalhe = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/dashboard`);
        const produtoEncontrado = res.data.find(p => p.id === parseInt(id));
        setProduto(produtoEncontrado);
      } catch (err) {
        console.error("Erro ao buscar detalhes do produto", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutoDetalhe();
  }, [id]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(Number(value))) return 'N/D';
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStoreIcon = (lojaNome) => {
    const lowerName = lojaNome.toLowerCase();
    if (lowerName.includes('amazon')) return <FaAmazon size={24} color="#FF9900" />;
    if (lowerName.includes('mercado livre')) return <SiMercadopago size={24} color="#FFE600" />;
    if (lowerName.includes('magalu')) return <span style={styles.logoText}>M</span>;
    return null;
  };

  // Agrupa ofertas por loja e pega apenas a melhor de cada loja
  const getMelhoresOfertasPorLoja = () => {
    if (!produto?.ofertas || produto.ofertas.length === 0) return [];
    
    // Agrupa ofertas por loja
    const ofertasPorLoja = {};
    produto.ofertas.forEach(oferta => {
      const loja = oferta.loja;
      if (!ofertasPorLoja[loja] || oferta.preco_atual < ofertasPorLoja[loja].preco_atual) {
        ofertasPorLoja[loja] = oferta;
      }
    });
    
    // Retorna array com a melhor oferta de cada loja, ordenado por preço
    return Object.values(ofertasPorLoja).sort((a, b) => a.preco_atual - b.preco_atual);
  };

  const getMelhorOfertaGeral = (ofertas) => {
    if (!ofertas || ofertas.length === 0) return null;
    return ofertas[0]; // Já está ordenado por preço
  };

  if (loading) return <div style={styles.loading}>Carregando...</div>;
  if (!produto) return <div style={styles.loading}>Produto não encontrado</div>;

  const melhoresOfertas = getMelhoresOfertasPorLoja();
  const melhorOfertaGeral = getMelhorOfertaGeral(melhoresOfertas);

  return (
    <div style={styles.container}>

      {/* Seção: Informações do Produto Monitorado */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Produto Monitorado</h2>
        <div style={styles.produtoInfo}>
          <div style={styles.imageContainer}>
            <img 
              src={placeholderImg} 
              alt={produto.nome_produto} 
              style={styles.productImage} 
            />
          </div>
          <div style={styles.detailsContainer}>
            <h3 style={styles.productName}>{produto.nome_produto}</h3>
            
            <div style={styles.configsGrid}>
              <div style={styles.configItem}>
                <span style={styles.configLabel}>Preço Máximo Desejado:</span>
                <span style={styles.configValue}>{formatCurrency(produto.preco_maximo_desejado)}</span>
              </div>
              
              {produto.ram_desejada && (
                <div style={styles.configItem}>
                  <span style={styles.configLabel}>RAM Desejada:</span>
                  <span style={styles.configValue}>{produto.ram_desejada}</span>
                </div>
              )}
              
              {produto.cpu_modelo_desejado && (
                <div style={styles.configItem}>
                  <span style={styles.configLabel}>CPU Desejada:</span>
                  <span style={styles.configValue}>{produto.cpu_modelo_desejado}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Seção: Comparação de Preços nas Lojas */}
      <div style={styles.comparacaoSection}>
        <h2 style={styles.comparacaoTitle}>Compare preços em {melhoresOfertas.length} lojas</h2>
        
        {melhoresOfertas.length === 0 ? (
          <p style={styles.noOfertas}>Nenhuma oferta disponível no momento.</p>
        ) : (
          <div style={styles.ofertasList}>
            {melhoresOfertas.map((oferta, index) => (
              <div key={index} style={styles.ofertaRow}>
                <div style={styles.ofertaLeft}>
                  <img 
                    src={placeholderImg} 
                    alt={produto.nome_produto} 
                    style={styles.ofertaImage} 
                  />
                  <div style={styles.ofertaInfo}>
                    <div style={styles.ofertaPreco}>
                      {formatCurrency(oferta.preco_atual)}
                    </div>
                    <div style={styles.ofertaLoja}>
                      {getStoreIcon(oferta.loja)}
                      <span style={styles.lojaTexto}>{oferta.loja}</span>
                    </div>
                    <div style={styles.lojaOrigem}>Brasil</div>
                  </div>
                </div>
                
                <a 
                  href={oferta.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={styles.irLojaBtn}
                >
                  Ir à loja
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px 0',
  },
  loading: {
    padding: '50px',
    textAlign: 'center',
    color: '#666',
    fontSize: '18px',
  },
  section: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '20px',
    borderBottom: '2px solid #f3f4f6',
    paddingBottom: '10px',
  },
  produtoInfo: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  imageContainer: {
    flex: '0 0 auto',
    width: '300px',
    height: '225px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  productImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  detailsContainer: {
    flex: '1',
    minWidth: '300px',
  },
  productName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '20px',
  },
  configsGrid: {
    display: 'grid',
    gap: '15px',
    marginBottom: '25px',
  },
  configItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  configLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
  },
  configValue: {
    fontSize: '14px',
    color: '#111827',
    fontWeight: '600',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0086FF',
    border: '2px solid #0086FF',
    borderRadius: '4px',
    padding: '2px 8px',
  },
  
  // Estilos da seção de comparação
  comparacaoSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  comparacaoTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '25px',
  },
  ofertasList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  ofertaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  ofertaLeft: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  ofertaImage: {
    width: '100px',
    height: '75px',
    objectFit: 'contain',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '5px',
  },
  ofertaInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  ofertaPreco: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
  },
  ofertaLoja: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  lojaTexto: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  lojaOrigem: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  irLojaBtn: {
    backgroundColor: '#1e2330',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  noOfertas: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '16px',
    padding: '40px',
  },
};

export default ProdutoDetalhe;