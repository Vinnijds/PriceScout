
const db = require('../../db');
const bcrypt = require('bcryptjs');

const TEST_USER_ID = 1;

// GET /perfil - Obter dados do usuário
async function getPerfilUsuario(req, res) {
    const usuarioId = req.user ? req.user.userId : TEST_USER_ID;

    try {
        const query = 'SELECT id, nome, email FROM Usuarios WHERE id = $1';
        const { rows } = await db.query(query, [usuarioId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error.stack);
        return res.status(500).json({ message: "Erro interno ao buscar perfil." });
    }
}

// PUT /perfil - Atualizar informações básicas
async function atualizarPerfil(req, res) {
    const usuarioId = req.user ? req.user.userId : TEST_USER_ID;
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
    }

    try {
        // Verifica se o email já está em uso por outro usuário
        const emailCheck = await db.query(
            'SELECT id FROM Usuarios WHERE email = $1 AND id != $2',
            [email, usuarioId]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({ message: 'Este email já está em uso.' });
        }

        const query = `
            UPDATE Usuarios 
            SET nome = $1, email = $2 
            WHERE id = $3 
            RETURNING id, nome, email
        `;
        
        const { rows } = await db.query(query, [nome, email, usuarioId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        return res.json({
            message: 'Perfil atualizado com sucesso!',
            user: rows[0]
        });
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error.stack);
        return res.status(500).json({ message: "Erro interno ao atualizar perfil." });
    }
}

// PUT /perfil/senha - Atualizar senha
async function atualizarSenha(req, res) {
    const usuarioId = req.user ? req.user.userId : TEST_USER_ID;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias.' });
    }

    // Validação de senha forte
    if (novaSenha.length < 8) {
        return res.status(400).json({ message: 'A nova senha deve ter pelo menos 8 caracteres.' });
    }

    if (!/[0-9]/.test(novaSenha)) {
        return res.status(400).json({ message: 'A nova senha deve conter pelo menos um número.' });
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(novaSenha)) {
        return res.status(400).json({ message: 'A nova senha deve conter pelo menos um caractere especial.' });
    }

    try {
        // Busca o usuário e verifica a senha atual
        const userQuery = 'SELECT senha_hash FROM Usuarios WHERE id = $1';
        const { rows } = await db.query(userQuery, [usuarioId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const senhaValida = await bcrypt.compare(senhaAtual, rows[0].senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ message: 'Senha atual incorreta.' });
        }

        // Hash da nova senha
        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

        // Atualiza a senha
        const updateQuery = 'UPDATE Usuarios SET senha_hash = $1 WHERE id = $2';
        await db.query(updateQuery, [novaSenhaHash, usuarioId]);

        return res.json({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
        console.error("Erro ao atualizar senha:", error.stack);
        return res.status(500).json({ message: "Erro interno ao atualizar senha." });
    }
}

module.exports = {
    getPerfilUsuario,
    atualizarPerfil,
    atualizarSenha
};