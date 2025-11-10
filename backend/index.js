// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Nosso módulo de conexão

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Middlewares
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // Não autorizado (sem token)
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Proibido (token inválido)
    }

    // Importante: Adiciona os dados do usuário (ex: id) na requisição
    req.user = user; 
    next(); // Continua para a rota protegida
  });
};

// ROTA DE TESTE
app.get('/', (req, res) => {
  res.json({ message: 'A API do Radar de Ofertas está no ar! 🚀' });
});

// --- ROTAS DE AUTENTICAÇÃO ---

// RF-001: Cadastro de Usuário
app.post('/users/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await db.query(
      'INSERT INTO Usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, email',
      [nome, email, senhaHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // Código de violação de constraint (email único)
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// RF-002: Login de Usuário
app.post('/users/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // 1. Encontrar o usuário
    const result = await db.query('SELECT * FROM Usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    // 2. Verificar a senha
    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    // 3. Gerar o Token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // O que vai dentro do token
      process.env.JWT_SECRET,                  // A chave secreta
      { expiresIn: '1h' }                      // Tempo de expiração
    );

    res.json({
      message: 'Login bem-sucedido!',
      token: token,
      user: { id: user.id, nome: user.nome, email: user.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// --- (Rotas protegidas virão aqui) ---

// RF-003: Listar TODOS os 5 produtos monitorados
app.get('/products', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Produtos ORDER BY nome_produto');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// RF-004: Seguir um produto (e definir preço - RF-005)
app.post('/products/:id/follow', authenticateToken, async (req, res) => {
  const { id: produtoId } = req.params;
  const { userId } = req.user; // Pego do middleware (authenticateToken)
  const { precoDesejado } = req.body; // Pega o preço do corpo da requisição

  try {
    // Usamos ON CONFLICT para fazer um "UPSERT" (Update ou Insert)
    // Se o usuário já segue, apenas atualiza o preço. Se não, insere.
    const result = await db.query(
      `INSERT INTO Usuarios_Seguindo (usuario_id, produto_id, preco_desejado) 
       VALUES ($1, $2, $3)
       ON CONFLICT (usuario_id, produto_id) 
       DO UPDATE SET preco_desejado = $3
       RETURNING *`,
      [userId, produtoId, precoDesejado || null] // Usa null se o preço não for enviado
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// RF-006: Deixar de seguir um produto
app.delete('/products/:id/follow', authenticateToken, async (req, res) => {
  const { id: produtoId } = req.params;
  const { userId } = req.user;

  try {
    await db.query(
      'DELETE FROM Usuarios_Seguindo WHERE usuario_id = $1 AND produto_id = $2',
      [userId, produtoId]
    );
    res.sendStatus(204); // "No Content" (sucesso sem corpo de resposta)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// RF-007: Ver o Dashboard (produtos seguidos + ofertas)
app.get('/dashboard', authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    // Query complexa para buscar os produtos que o usuário segue E
    // fazer um sub-select (em JSON) de todas as ofertas ativas para CADA produto.
    const query = `
      SELECT 
        p.*, 
        us.preco_desejado,
        (
          SELECT COALESCE(json_agg(o.*), '[]') 
          FROM Ofertas o 
          WHERE o.produto_id = p.id
        ) as ofertas
      FROM Usuarios_Seguindo us
      JOIN Produtos p ON us.produto_id = p.id
      WHERE us.usuario_id = $1;
    `;

    const result = await db.query(query, [userId]);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.get('/products/:id', authenticateToken, async (req, res) => {
  const { id: produtoId } = req.params;

  try {
    // Mesma lógica do dashboard, mas para um ID
    const query = `
      SELECT 
        p.*, 
        (
          SELECT COALESCE(json_agg(o.*), '[]') 
          FROM Ofertas o 
          WHERE o.produto_id = p.id
        ) as ofertas
      FROM Produtos p
      WHERE p.id = $1;
    `;
    
    const result = await db.query(query, [produtoId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.json(result.rows[0]); // Retorna o primeiro (e único) produto

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor da API rodando em http://localhost:${PORT}`);
});