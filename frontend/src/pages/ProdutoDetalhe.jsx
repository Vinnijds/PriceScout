import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaAmazon } from 'react-icons/fa';
import { SiMercadopago } from 'react-icons/si';

const placeholderImg = "https://placehold.co/400x300/png?text=Notebook";

/**
 * Mapeia nome do produto -> imagem local
 * AJUSTE se mudar os nomes
 */
const imagensMap = {
  acer: "/images/acer1.jpg",
  asus: "/images/asus.jpg",
  dell: "/images/dell1.jpg",
  lenovo: "/images/lenovo.jpg",
  macbook: "/images/macbook.jpg",
};

function ProdutoDetalhe() {
  const { id } = useParams();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutoDetalhe = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/dashboard`);

        const produtoEncontrado = res.data.find(
          p => p.id === parseInt(id)
        );

        setProduto(produtoEncontrado);

      } catch (err) {
        console.error("Erro ao buscar produto", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutoDetalhe();
  }, [id]);


  // 🔥 Resolve imagem local automaticamente
  const getImagemProduto = (nome) => {
    if (!nome) return placeholderImg;

    const nomeLower = nome.toLowerCase();

    for (const key in imagensMap) {
      if (nomeLower.includes(key)) {
        return imagensMap[key];
      }
    }

    return placeholderImg;
  };


  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return 'N/D';
    }

    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };


  const getStoreIcon = (lojaNome) => {
    const lowerName = lojaNome.toLowerCase();

    if (lowerName.includes('amazon')) {
      return <FaAmazon size={24} color="#FF9900" />;
    }

    if (lowerName.includes('mercado livre')) {
      return <SiMercadopago size={24} color="#FFE600" />;
    }

    return null;
  };


  const getMelhoresOfertasPorLoja = () => {
    if (!produto?.ofertas?.length) return [];

    const ofertasPorLoja = {};

    produto.ofertas.forEach(oferta => {
      const loja = oferta.loja;

      if (
        !ofertasPorLoja[loja] ||
        oferta.preco_atual < ofertasPorLoja[loja].preco_atual
      ) {
        ofertasPorLoja[loja] = oferta;
      }
    });

    return Object.values(ofertasPorLoja).sort(
      (a, b) => a.preco_atual - b.preco_atual
    );
  };


  if (loading) {
    return <div style={styles.loading}>Carregando...</div>;
  }

  if (!produto) {
    return <div style={styles.loading}>Produto não encontrado</div>;
  }


  const melhoresOfertas = getMelhoresOfertasPorLoja();

  const imagemFinal = getImagemProduto(produto.nome_produto);


  return (
    <div style={styles.container}>

      {/* Produto */}
      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>Produto Monitorado</h2>

        <div style={styles.produtoInfo}>

          <div style={styles.imageContainer}>
            <img
              src={imagemFinal}
              alt={produto.nome_produto}
              style={styles.productImage}
            />
          </div>


          <div style={styles.detailsContainer}>

            <h3 style={styles.productName}>
              {produto.nome_produto}
            </h3>

            <div style={styles.configsGrid}>

              <div style={styles.configItem}>
                <span style={styles.configLabel}>
                  Preço Máximo:
                </span>

                <span style={styles.configValue}>
                  {formatCurrency(produto.preco_maximo_desejado)}
                </span>
              </div>

              {produto.ram_desejada && (
                <div style={styles.configItem}>
                  <span style={styles.configLabel}>RAM:</span>
                  <span style={styles.configValue}>
                    {produto.ram_desejada}
                  </span>
                </div>
              )}

              {produto.cpu_modelo_desejado && (
                <div style={styles.configItem}>
                  <span style={styles.configLabel}>CPU:</span>
                  <span style={styles.configValue}>
                    {produto.cpu_modelo_desejado}
                  </span>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>


      {/* Ofertas */}
      <div style={styles.comparacaoSection}>

        <h2 style={styles.comparacaoTitle}>
          Compare preços em {melhoresOfertas.length} lojas
        </h2>


        {melhoresOfertas.length === 0 ? (

          <p style={styles.noOfertas}>
            Nenhuma oferta disponível
          </p>

        ) : (

          <div style={styles.ofertasList}>

            {melhoresOfertas.map((oferta, index) => (

              <div key={index} style={styles.ofertaRow}>

                <div style={styles.ofertaLeft}>

                  <img
                    src={imagemFinal}
                    alt={produto.nome_produto}
                    style={styles.ofertaImage}
                  />

                  <div style={styles.ofertaInfo}>

                    <div style={styles.ofertaPreco}>
                      {formatCurrency(oferta.preco_atual)}
                    </div>

                    <div style={styles.ofertaLoja}>
                      {getStoreIcon(oferta.loja)}
                      <span style={styles.lojaTexto}>
                        {oferta.loja}
                      </span>
                    </div>

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
    marginBottom: '20px',
  },
  produtoInfo: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: '300px',
    height: '225px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  productImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '20px',
  },
  configsGrid: {
    display: 'grid',
    gap: '15px',
  },
  configItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  configLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  configValue: {
    fontSize: '14px',
    fontWeight: '600',
  },
  comparacaoSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  comparacaoTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '25px',
  },
  ofertasList: {
    display: 'flex',
    flexDirection: 'column',
  },
  ofertaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  ofertaLeft: {
    display: 'flex',
    gap: '20px',
  },
  ofertaImage: {
    width: '100px',
    height: '75px',
    objectFit: 'contain',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  ofertaInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  ofertaPreco: {
    fontSize: '20px',
    fontWeight: '700',
  },
  ofertaLoja: {
    display: 'flex',
    gap: '8px',
  },
  lojaTexto: {
    fontSize: '14px',
  },
  irLojaBtn: {
    backgroundColor: '#1e2330',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
  },
  noOfertas: {
    textAlign: 'center',
    padding: '40px',
  },
};

export default ProdutoDetalhe;
