// src/pages/Comparar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Imagem de placeholder
const placeholderImg = "https://via.placeholder.com/300x200.png?text=Sem+Imagem";

function Comparar() {
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [selecionados, setSelecionados] = useState([]); // Armazena os IDs
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Busca todos os produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const response = await api.get('/products');
        setTodosProdutos(response.data);
      } catch (err) {
        console.error("Erro ao buscar produtos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  // Lógica de Seleção
  const handleSelect = (produto) => {
    const id = produto.id;
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter(selId => selId !== id));
    } else if (selecionados.length < 2) {
      setSelecionados([...selecionados, id]);
    } else {
      alert("Você só pode selecionar 2 notebooks para comparar.");
    }
  };

  // Lógica do botão "Comparar"
  const handleCompare = () => {
    if (selecionados.length === 2) {
      navigate(`/comparar/${selecionados[0]}/${selecionados[1]}`);
    }
  };

  if (loading) return <div style={styles.loading}>Carregando produtos...</div>;

  return (
    <>
      <div style={styles.header}>
        <h3 style={styles.title}>Compare Notebooks</h3>
        {selecionados.length === 2 && (
          <button style={styles.compareBtn} onClick={handleCompare}>
            Comparar Selecionados
          </button>
        )}
      </div>

      <div style={styles.grid}>
        {todosProdutos.map(produto => {
          const isSelected = selecionados.includes(produto.id);
          return (
            <div key={produto.id} style={styles.productCard}>
              <div style={styles.imageContainer}>
                <img src={placeholderImg} alt={produto.nome_produto} style={styles.productImage} />
              </div>
              <h4 style={styles.productName}>{produto.nome_produto}</h4>
              <button 
                style={isSelected ? styles.btnSelected : styles.btnSelect}
                onClick={() => handleSelect(produto)}
              >
                {isSelected ? 'Selecionado' : 'Selecionar'}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Estilos
const styles = {
  loading: { fontSize: '20px', color: '#555', textAlign: 'center', padding: '50px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  title: { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 },
  compareBtn: {
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    padding: '15px',
  },
  imageContainer: {
    width: '100%',
    paddingTop: '66.66%',
    position: 'relative',
    backgroundColor: '#eee',
    borderRadius: '5px',
  },
  productImage: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
  },
  productName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    padding: '10px 0',
    textAlign: 'center',
    flexGrow: 1,
  },
  btnSelect: {
    backgroundColor: '#3b5998',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 10px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  btnSelected: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 10px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  }
};

export default Comparar;