require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Módulo de conexão

// Importa o módulo do scraper
const scraper = require('./scraper/run');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Middleware de Autenticação ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; 
    next();
  });
};

app.get('/', (req, res) => res.json({ message: 'API PriceScout Online 🚀' }));

// --- ROTAS DE USUÁRIO ---

app.post('/users/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Campos obrigatórios.' });
  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const result = await db.query(
      'INSERT INTO Usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, email',
      [nome, email, senhaHash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'E-mail já cadastrado.' });
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

app.post('/users/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await db.query('SELECT * FROM Usuarios WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(senha, user.senha_hash))) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const token = jwt.sign(
        { userId: user.id, email: user.email, nome: user.nome }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2h' }
    );
    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// --- ROTAS PROTEGIDAS (AÇÕES DO APP) ---

// [NOVO] Rota para ADICIONAR um novo produto ao banco
app.post('/products/add', authenticateToken, async (req, res) => {
    const { nome_produto, termo_busca, cpu_base, ram_base, armazenamento_base, tela_base } = req.body;
    const { userId } = req.user;

    if (!nome_produto || !termo_busca) {
        return res.status(400).json({ error: 'Nome e Termo de Busca são obrigatórios.' });
    }

    // Usamos 'WITH' para fazer duas coisas: Inserir o produto E fazer o usuário segui-lo.
    const query = `
        WITH novo_produto AS (
            INSERT INTO Produtos (
                nome_produto, termo_busca, cpu_base, ram_base, armazenamento_base, tela_base
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        )
        INSERT INTO Usuarios_Seguindo (usuario_id, produto_id, preco_desejado)
        VALUES ($7, (SELECT id FROM novo_produto), NULL)
        RETURNING produto_id;
    `;

    try {
        const result = await db.query(query, [
            nome_produto, termo_busca, cpu_base || null, ram_base || null, 
            armazenamento_base || null, tela_base || null, userId
        ]);
        res.status(201).json({ message: 'Produto adicionado e monitorado!', produto: result.rows[0] });
    } catch (err) {
        console.error("Erro ao adicionar produto:", err);
        res.status(500).json({ error: 'Falha ao adicionar produto.' });
    }
});

// [NOVO] Rota para DISPARAR o scraper manualmente
app.post('/api/run-scraper', authenticateToken, async (req, res) => {
  if (!scraper || !scraper.executarScraper) {
    return res.status(500).json({ error: 'Serviço de scraper indisponível.' });
  }
  
  console.log(`[API] Usuário ${req.user.nome} solicitou atualização de preços.`);
  try {
    // Executa o scraper
    const resultado = await scraper.executarScraper();
    res.json({ message: `Varredura concluída! ${resultado.total} ofertas atualizadas.`, detalhes: resultado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha na execução do scraper.' });
  }
});

// Rota para Listar TODOS os produtos (para a antiga lista "Disponível")
app.get('/products', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Produtos ORDER BY nome_produto');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

// Rota para Detalhes do Produto + Ofertas
app.get('/products/:id', authenticateToken, async (req, res) => {
    try {
      const query = `
        SELECT p.*, 
        (SELECT COALESCE(json_agg(o.* ORDER BY o.preco_atual ASC), '[]') FROM Ofertas o WHERE o.produto_id = p.id) as ofertas
        FROM Produtos p WHERE p.id = $1
      `;
      const result = await db.query(query, [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro no servidor.' });
    }
});

// Rota do Dashboard (Produtos que o usuário segue)
app.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT p.*, us.preco_desejado,
      (SELECT COALESCE(json_agg(o.* ORDER BY o.preco_atual ASC), '[]') FROM Ofertas o WHERE o.produto_id = p.id) as ofertas
      FROM Usuarios_Seguindo us
      JOIN Produtos p ON us.produto_id = p.id
      WHERE us.usuario_id = $1
      ORDER BY p.nome_produto;
    `;
    const result = await db.query(query, [req.user.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao carregar dashboard.' });
  }
});

// Seguir / Editar Preço
app.post('/products/:id/follow', authenticateToken, async (req, res) => {
  const { precoDesejado } = req.body;
  try {
    await db.query(
      `INSERT INTO Usuarios_Seguindo (usuario_id, produto_id, preco_desejado) VALUES ($1, $2, $3)
       ON CONFLICT (usuario_id, produto_id) DO UPDATE SET preco_desejado = $3`,
      [req.user.userId, req.params.id, precoDesejado || null]
    );
    res.status(200).json({ message: 'Seguindo produto.' });
  } catch (err) { res.status(500).json({ error: 'Erro ao seguir.' }); }
});

// Deixar de Seguir
app.delete('/products/:id/follow', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM Usuarios_Seguindo WHERE usuario_id = $1 AND produto_id = $2', [req.user.userId, req.params.id]);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Erro ao deixar de seguir.' }); }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor da API rodando em http://localhost:${PORT}`);
});