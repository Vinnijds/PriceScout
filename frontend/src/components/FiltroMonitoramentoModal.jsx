import React, { useState, useEffect } from 'react';
import api from '../services/api';

function FiltroMonitoramentoModal({ isOpen, onClose, produto, onFiltroAplicado }) {
    const [filtros, setFiltros] = useState({
        ram_desejada: '',
        armazenamento_desejado: '',
        memoria_tipo_desejada: '',
        gpu_tipo_desejada: '',
        cpu_modelo_desejado: '',
        so_desejado: '',
        tela_tipo_desejada: '',
        preco_maximo_desejado: 3500
    });
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && produto) {
            setFiltros({
                ram_desejada: '8gb',
                armazenamento_desejado: '256gb',
                memoria_tipo_desejada: 'so-dimm',
                gpu_tipo_desejada: 'integrada',
                cpu_modelo_desejado: 'i5',
                so_desejado: 'windows',
                tela_tipo_desejada: 'ips',
                preco_maximo_desejado: 4000
            });
        }
    }, [isOpen, produto]);

    const handleChange = (name, value) => {
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleSliderChange = (e) => {
        setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAplicarFiltro = async () => {
        if (!produto) return;
        setLoading(true);
        try {
            await api.post(`/products/${produto.id}/follow`, filtros);
            alert(`Monitoramento iniciado!`);
            onFiltroAplicado(); 
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !produto) return null;

    // Função auxiliar para renderizar opções como "Chips" (Etiquetas)
    const renderOption = (label, name, value) => {
        const isSelected = filtros[name] === value;
        return (
            <div 
                onClick={() => handleChange(name, value)}
                style={{
                    ...modalStyles.chip,
                    backgroundColor: isSelected ? '#1e2330' : '#e5e7eb',
                    color: isSelected ? '#fff' : '#374151',
                    border: isSelected ? '1px solid #1e2330' : '1px solid #e5e7eb'
                }}
            >
                <div style={{
                    width: '12px', height: '12px', borderRadius: '50%', 
                    border: '2px solid', borderColor: isSelected ? '#fff' : '#9ca3af',
                    backgroundColor: isSelected ? '#fff' : 'transparent',
                    marginRight: '8px'
                }}></div>
                {label}
            </div>
        );
    };

    return (
        <div style={modalStyles.backdrop}>
            <div style={modalStyles.modal}>
                <h2 style={modalStyles.header}>Filtro para Monitoramento: {produto.nome_produto}</h2>
                
                <div style={modalStyles.scrollContainer}>
                    <div style={modalStyles.grid}>
                        
                        {/* Coluna 1 */}
                        <div style={modalStyles.column}>
                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.label}>Memória RAM:</h4>
                                <div style={modalStyles.optionsRow}>
                                    {renderOption('8 gb', 'ram_desejada', '8gb')}
                                    {renderOption('16 gb', 'ram_desejada', '16gb')}
                                    {renderOption('32 gb', 'ram_desejada', '32gb')}
                                </div>
                            </div>

                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.label}>Memória:</h4>
                                <div style={modalStyles.optionsRow}>
                                    {renderOption('Soldada', 'memoria_tipo_desejada', 'soldada')}
                                    {renderOption('SO-DIMM', 'memoria_tipo_desejada', 'so-dimm')}
                                </div>
                            </div>

                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.label}>Processador (Intel):</h4>
                                <div style={modalStyles.optionsRow}>
                                    {['i3', 'i5', 'i7', 'i9'].map(cpu => renderOption(cpu, 'cpu_modelo_desejado', cpu))}
                                </div>
                                <h4 style={{...modalStyles.label, marginTop: 10}}>Processador (AMD):</h4>
                                <div style={modalStyles.optionsRow}>
                                    {['Ryzen 3', 'Ryzen 5', 'Ryzen 7'].map(cpu => renderOption(cpu, 'cpu_modelo_desejado', cpu.toLowerCase()))}
                                </div>
                            </div>
                        </div>

                        {/* Coluna 2 */}
                        <div style={modalStyles.column}>
                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.label}>Armazenamento:</h4>
                                <div style={modalStyles.optionsRow}>
                                    {renderOption('256 gb', 'armazenamento_desejado', '256gb')}
                                    {renderOption('512 gb', 'armazenamento_desejado', '512gb')}
                                    {renderOption('1 tb', 'armazenamento_desejado', '1tb')}
                                </div>
                            </div>

                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.label}>Placa de vídeo:</h4>
                                <div style={modalStyles.optionsRow}>
                                    {renderOption('Integrada', 'gpu_tipo_desejada', 'integrada')}
                                    {renderOption('Dedicada', 'gpu_tipo_desejada', 'dedicada')}
                                </div>
                            </div>

                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.label}>Sistema operacional:</h4>
                                <div style={modalStyles.optionsRow}>
                                    {renderOption('Windows', 'so_desejado', 'windows')}
                                    {renderOption('Linux', 'so_desejado', 'linux')}
                                </div>
                            </div>

                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.label}>Tela/Painel:</h4>
                                <div style={modalStyles.optionsRow}>
                                    {renderOption('TN', 'tela_tipo_desejada', 'tn')}
                                    {renderOption('IPS', 'tela_tipo_desejada', 'ips')}
                                    {renderOption('WVA', 'tela_tipo_desejada', 'wva')}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Slider de Preço - Ocupa largura total */}
                    <div style={{ marginTop: '30px', padding: '0 10px' }}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom: 10}}>
                            <h4 style={modalStyles.label}>Ajustar Preço-alvo</h4>
                            <span style={{fontWeight:'bold', fontSize: '18px', color:'#1e2330'}}>R${filtros.preco_maximo_desejado}</span>
                        </div>
                        <input
                            type="range"
                            name="preco_maximo_desejado"
                            min="1500"
                            max="10000"
                            step="100"
                            value={filtros.preco_maximo_desejado}
                            onChange={handleSliderChange}
                            style={{width: '100%', cursor: 'pointer', accentColor: '#1e2330'}}
                        />
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: 12, color:'#888', marginTop: 5}}>
                            <span>R$2700</span>
                            <span>R$4200</span>
                        </div>
                    </div>
                </div>

                <div style={modalStyles.actions}>
                    <button onClick={onClose} style={modalStyles.cancelBtn}>Cancelar</button>
                    <button onClick={handleAplicarFiltro} disabled={loading} style={modalStyles.applyBtn}>
                        {loading ? 'Salvando...' : 'Aplicar Filtro'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const modalStyles = {
    backdrop: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
        backdropFilter: 'blur(2px)'
    },
    modal: {
        backgroundColor: 'white', padding: '40px', borderRadius: '20px',
        width: '95%', maxWidth: '900px', maxHeight: '95vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        fontFamily: "'Inter', sans-serif"
    },
    header: { fontSize: '24px', fontWeight: '800', marginBottom: '30px', color: '#111827' },
    scrollContainer: { overflowY: 'auto', paddingRight: '10px', flex: 1 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' },
    column: { display: 'flex', flexDirection: 'column', gap: '20px' },
    section: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '15px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' },
    optionsRow: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    chip: {
        display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '999px',
        fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease',
        userSelect: 'none'
    },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' },
    cancelBtn: { 
        padding: '12px 24px', backgroundColor: '#1e2330', color: 'white', border: 'none', 
        borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' 
    },
    applyBtn: { 
        padding: '12px 24px', backgroundColor: '#1e2330', color: 'white', border: 'none', 
        borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' 
    }
};

export default FiltroMonitoramentoModal;