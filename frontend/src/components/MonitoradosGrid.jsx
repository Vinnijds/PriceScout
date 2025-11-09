import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Imagem de placeholder caso o produto não tenha uma
const placeholderImg = "https://via.placeholder.com/300x200.png?text=Sem+Imagem";

function MonitoradosGrid({ produtos, onEditPrice, onUnfollow }) {
  
  // Função para pegar a imagem. Usa a primeira imagem de oferta, ou um placeholder.
  const getProductImage = (produto) => {
    if (produto.ofertas && produto.ofertas.length > 0 && produto.ofertas[0].imagem_url) {
      return produto.ofertas[0].imagem_url;
    }
    // Se não tem, tenta pegar a imagem do notebook mais caro (fallback)
    const offerWithImage = produto.ofertas?.find(o => o.imagem_url);
    return offerWithImage ? offerWithImage.imagem_url : placeholderImg;
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Notebooks Monitorados</h3>
      <div style={styles.grid}>
        {produtos.map(produto => (
          <div key={produto.id} style={styles.productCard}>
            <div style={styles.imageContainer}>
              <img 
                src={getProductImage(produto)} 
                alt={produto.nome_produto} 
                style={styles.productImage} 
              />
            </div>
            <h4 style={styles.productName}>{produto.nome_produto}</h4>
            <div style={styles.actions}>
              <button style={styles.btnDetalhes}>Ver Detalhes</button>
              <div style={styles.iconButtons}>
                <FaEdit 
                  style={styles.icon} 
                  title="Editar preço-alvo"
                  onClick={() => onEditPrice(produto.id)} // Reutiliza a função de "seguir" para editar o preço
                />
                <FaTrash 
                  style={{...styles.icon, ...styles.iconDelete}} 
                  title="Parar de monitorar"
                  onClick={() => onUnfollow(produto.id)} // Chama a função de "deixar de seguir"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- ESTILOS ---
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', // Grid responsivo
    gap: '20px',
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    paddingTop: '66.66%', // Proporção 3:2
    position: 'relative',
    backgroundColor: '#eee',
  },
  productImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    padding: '10px 15px',
    textAlign: 'center',
    flexGrow: 1, // Faz o nome ocupar o espaço
  },
  actions: {
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #eee',
  },
  btnDetalhes: {
    backgroundColor: '#3b5998',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  iconButtons: {
    display: 'flex',
    gap: '10px',
  },
  icon: {
    fontSize: '16px',
    color: '#555',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  iconDelete: {
    color: '#e74c3c', // Vermelho
  }
};

export default MonitoradosGrid;