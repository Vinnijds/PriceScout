import React from 'react';
import { FaTrash, FaPen } from 'react-icons/fa';

function MonitoradosGrid({ produtos, onUnfollow, onEditPrice }) {
    if (!produtos || produtos.length === 0) return null;

    return (
        <div style={styles.grid}>
            {produtos.map(produto => (
                <div key={produto.id} style={styles.card}>
                    {/* Ícone de Lixeira no topo direito */}
                    <button 
                        onClick={() => onUnfollow(produto.id)}
                        style={styles.trashBtn}
                        title="Parar de monitorar"
                    >
                        <FaTrash size={14} />
                    </button>

                    <div style={styles.imageContainer}>
                         <img 
                            src="https://placehold.co/300x200/png?text=Notebook" 
                            alt={produto.nome_produto} 
                            style={styles.image} 
                        />
                    </div>
                    <h4 style={styles.name}>{produto.nome_produto}</h4>

                    {/* Área de Ações (Botão Detalhes + Botão Editar) */}
                    <div style={styles.actionsRow}>
                        <button style={styles.detailsBtn}>
                            Ver Detalhes
                        </button>
                        
                        <button 
                            onClick={() => onEditPrice(produto.id)}
                            style={styles.editBtn}
                            title="Editar filtro"
                        >
                            <FaPen size={14} color="white" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '30px',
        padding: '20px 0',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #f3f4f6',
        position: 'relative', // Para posicionar a lixeira
    },
    trashBtn: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#9ca3af', // Cinza claro
        padding: '5px',
    },
    imageContainer: {
        width: '100%',
        height: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '15px',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
    name: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '20px',
        textAlign: 'center',
    },
    actionsRow: {
        display: 'flex',
        width: '100%',
        gap: '10px',
        marginTop: 'auto'
    },
    detailsBtn: {
        backgroundColor: '#1e2330',
        color: 'white',
        border: 'none',
        padding: '10px 0',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
        flex: 1, // Ocupa espaço disponível
    },
    editBtn: {
        backgroundColor: '#1e2330',
        border: 'none',
        borderRadius: '8px',
        width: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    }
};

export default MonitoradosGrid;