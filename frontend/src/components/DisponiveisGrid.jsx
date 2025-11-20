import React from 'react';

function DisponiveisGrid({ notebooks, onMonitorar }) {
    if (!notebooks || notebooks.length === 0) return <p style={{padding: 20}}>Carregando produtos...</p>;

    return (
        <div style={styles.grid}>
            {notebooks.map(produto => (
                <div key={produto.id} style={styles.card}>
                    <div style={styles.imageContainer}>
                        {/* Placeholder simulando a foto do notebook */}
                        <img 
                            src="https://placehold.co/300x200/png?text=Notebook" 
                            alt={produto.nome_produto} 
                            style={styles.image} 
                        />
                    </div>
                    <h4 style={styles.name}>{produto.nome_produto}</h4>
                    
                    <button 
                        onClick={() => onMonitorar(produto)}
                        style={styles.monitorBtn}
                    >
                        Monitorar
                    </button>
                </div>
            ))}
        </div>
    );
}

const styles = {
    grid: {
        display: 'grid',
        // Ajuste para 3 colunas responsivas como na foto
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '30px',
        padding: '20px 0',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #f3f4f6',
        transition: 'transform 0.2s ease',
    },
    imageContainer: {
        width: '100%',
        height: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
    name: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111827', // Cor escura quase preta
        marginBottom: '24px',
        textAlign: 'center',
        height: '40px', // Altura fixa para alinhar botões
        display: 'flex',
        alignItems: 'center'
    },
    monitorBtn: {
        backgroundColor: '#1e2330', // Azul escuro do seu design
        color: 'white',
        border: 'none',
        padding: '12px 0',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        width: '100%',
        marginTop: 'auto',
        transition: 'background-color 0.2s',
    }
};

export default DisponiveisGrid;