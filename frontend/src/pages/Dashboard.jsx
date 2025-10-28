// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Nosso axios configurado
import { useAuth } from '../context/AuthContext'; // Para pegar o 'user'

function Dashboard() {
  const { user } = useAuth(); // Pega o usuário logado

  // Estados para armazenar os dados vindos da API
  const [produtosSeguidos, setProdutosSeguidos] = useState([]); // RF-007
  const [todosProdutos, setTodosProdutos] = useState([]);     // RF-003
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar TODOS os dados do dashboard
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Busca os produtos que o usuário JÁ SEGUE (RF-007)
      const seguidosResponse = await api.get('/dashboard');
      setProdutosSeguidos(seguidosResponse.data);

      // 2. Busca TODOS os 5 produtos (RF-003)
      const todosResponse = await api.get('/products');
      setTodosProdutos(todosResponse.data);

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect: Roda a função fetchData() assim que o componente é montado
  useEffect(() => {
    fetchData();
  }, []); // O array vazio [] significa "rode apenas uma vez"

  // Função para SEGUIR um produto (RF-004 / RF-005)
  const handleFollow = async (produtoId) => {
    // Pede o preço desejado
    const preco = prompt("Qual o seu preço-alvo para este produto? (Deixe em branco se não tiver)");

    if (preco === null) return; // Usuário cancelou

    const precoDesejado = parseFloat(preco) || null;

    try {
      // 3. Chama a API para seguir (RF-004)
      await api.post(`/products/${produtoId}/follow`, { precoDesejado });

      alert('Produto seguido com sucesso!');
      fetchData(); // Atualiza a lista após seguir

    } catch (err) {
      console.error("Erro ao seguir produto:", err);
      alert('Erro ao seguir produto.');
    }
  };

  // Função para DEIXAR DE SEGUIR um produto (RF-006)
  const handleUnfollow = async (produtoId) => {
    if (!confirm("Tem certeza que quer deixar de seguir este produto?")) {
      return;
    }

    try {
      // 4. Chama a API para deixar de seguir (RF-006)
      await api.delete(`/products/${produtoId}/follow`);

      alert('Você deixou de seguir o produto.');
      fetchData(); // Atualiza a lista

    } catch (err) {
      console.error("Erro ao deixar de seguir:", err);
      alert('Erro ao deixar de seguir.');
    }
  };

  // Renderização
  if (loading) return <div>Carregando dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Filtra os produtos que o usuário ainda NÃO segue
  const produtosNaoSeguidos = todosProdutos.filter(p => 
    !produtosSeguidos.some(s => s.id === p.id)
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard de {user.nome}</h2>

      {/* SEÇÃO 1: PRODUTOS SEGUIDOS (RF-007) */}
      <section>
        <h3>Seus Produtos Monitorados ({produtosSeguidos.length})</h3>
        {produtosSeguidos.length === 0 ? (
          <p>Você ainda não segue nenhum produto.</p>
        ) : (
          produtosSeguidos.map(produto => (
            <div key={produto.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
              <h4>{produto.nome_produto}</h4>
              <p>Preço-Alvo: R$ {produto.preco_desejado || 'N/D'}</p>
              <button onClick={() => handleUnfollow(produto.id)}>Deixar de Seguir</button>

              {/* Sub-lista de Ofertas (do RF-007) */}
              <h5>Ofertas Encontradas ({produto.ofertas.length}):</h5>
              {produto.ofertas.length > 0 ? (
                <ul>
                  {produto.ofertas.map(oferta => (
                    <li key={oferta.id}>
                      <a href={oferta.url} target="_blank" rel="noopener noreferrer">
                        {oferta.loja}: R$ {oferta.preco_atual} - {oferta.titulo_extraido.substring(0, 50)}...
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>(Nenhuma oferta encontrada ainda pelos nossos robôs)</p>
              )}
            </div>
          ))
        )}
      </section>

      <hr style={{ margin: '30px 0' }} />

      {/* SEÇÃO 2: PRODUTOS PARA SEGUIR (RF-003) */}
      <section>
        <h3>Descobrir Novos Produtos ({produtosNaoSeguidos.length})</h3>
        {produtosNaoSeguidos.map(produto => (
          <div key={produto.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
            <h4>{produto.nome_produto}</h4>
            <p>CPU: {produto.cpu_base} | RAM: {produto.ram_base} | SSD: {produto.armazenamento_base}</p>
            <button onClick={() => handleFollow(produto.id)}>
              Seguir este Produto
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;