// src/pages/ComparacaoDetalhe.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaAmazon } from 'react-icons/fa';
// CORREÇÃO: Removemos o SiMagazineluiza que estava causando o erro
import { SiMercadopago } from 'react-icons/si';

// Imagem de placeholder
const placeholderImg = "https://via.placeholder.com/300x200.png?text=Sem+Imagem";

// Componente auxiliar para a coluna de um produto
function ProdutoColuna({ produto }) {
  if (!produto) return <div style={styles.card}>Carregando...</div>;

  const getProductImage = (prod) => {
    if (prod.ofertas && prod.ofertas.length > 0 && prod.ofertas[0].imagem_url) {
      return prod.ofertas[0].imagem_url;
    }
    const offerWithImage = prod.ofertas?.find(o => o.imagem_url);
    return offerWithImage ? offerWithImage.imagem_url : placeholderImg;
  };
  
  const getStoreIcon = (lojaNome) => {
    if (lojaNome.toLowerCase().includes('amazon')) return <FaAmazon color="#FF9900" />;
    if (lojaNome.toLowerCase().includes('mercado livre')) return <SiMercadopago color="#FFE600" />;
    // CORREÇÃO: Trocamos o ícone quebrado por um <span>
    if (lojaNome.toLowerCase().includes('magalu')) return <span style={{...styles.logoText, color: '#0086FF'}}>M</span>;
    return null;
  };

  const specs = [
    { label: 'Marca', value: produto.nome_produto.split(' ')[0] },
    { label: 'Modelo', value: produto.nome_produto },
    { label: 'Tamanho da tela', value: produto.tela_base },
    { label: 'Cor', value: 'N/D' },
    { label: 'Tamanho do disco rígido', value: produto.armazenamento_base },
    { label: 'Modelo da CPU', value: produto.cpu_base },
    { label: 'Tamanho instalado da RAM', value: produto.ram_base },
    { label: 'Sistema operacional', value: 'Windows' },
    { label: 'Placa de vídeo', value: 'Dedicada' },
  ];

  return (
    <div style={styles.column}>
      {/* Card de Specs */}
      <div style={styles.card}>
        <h2 style={styles.title}>{produto.nome_produto}</h2>
        <img src={getProductImage(produto)} alt={produto.nome_produto} style={styles.productImage} />
        <table style={styles.specsTable}>
          <tbody>
            {specs.map(spec => (
              <tr key={spec.label}>
                <td style={styles.specLabel}>{spec.label}</td>
                <td style={styles.specValue}>{spec.value || 'N/D'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Card de Ofertas */}
      <div style={styles.card}>
        <h3 style={styles.title}>Compare preços em {produto.ofertas.length} lojas</h3>
        <div style={styles.offerList}>
          {produto.ofertas.map(oferta => (
            <div key={oferta.id} style={styles.offerItem}>
              <img src={oferta.imagem_url || placeholderImg} alt={oferta.titulo_extraido} style={styles.offerImage} />
              <div style={styles.offerDetails}>
                <div style={styles.offerStore}>
                  {getStoreIcon(oferta.loja)}
                  <span>{oferta.loja}</span>
                </div>
                <span style={styles.offerPrice}>{oferta.preco_atual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <a href={oferta.url} target="_blank" rel="noopener noreferrer" style={styles.offerButton}>
                Ir à loja
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// Componente principal da página
function ComparacaoDetalhe() {
  const { id1, id2 } = useParams();
  const [produto1, setProduto1] = useState(null);
  const [produto2, setProduto2] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalhes = async () => {
      setLoading(true);
      try {
        const [res1, res2] = await Promise.all([
          api.get(`/products/${id1}`),
          api.get(`/products/${id2}`)
        ]);
        setProduto1(res1.data);
        setProduto2(res2.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes da comparação", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhes();
  }, [id1, id2]);

  if (loading) return <div style={styles.loading}>Carregando comparação...</div>;

  return (
    <div style={styles.compareContainer}>
      <ProdutoColuna produto={produto1} />
      <ProdutoColuna produto={produto2} />
    </div>
  );
}

// Estilos
const styles = {
  loading: { fontSize: '20px', color: '#555', textAlign: 'center', padding: '50px' },
  compareContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    alignItems: 'flex-start',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
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
  productImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  specsTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  specLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
    padding: '8px 0',
    borderBottom: '1px solid #f0f2f5',
    width: '40%',
  },
  specValue: {
    color: '#555',
    fontSize: '14px',
    padding: '8px 0',
    borderBottom: '1px solid #f0f2f5',
  },
  offerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  offerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  offerImage: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    borderRadius: '5px',
  },
  offerDetails: {
    flex: 1,
  },
  offerStore: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    color: '#555',
  },
  offerPrice: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  offerButton: {
    backgroundColor: '#3b5998',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
  },
  // CORREÇÃO: Adicionando o estilo que faltava para o <span>
  logoText: {
    fontWeight: 'bold',
    fontSize: '22px',
  },
};

export default ComparacaoDetalhe;