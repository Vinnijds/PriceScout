// backend/db.js (Conteúdo Original)
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
 host: process.env.DB_HOST,
 port: process.env.DB_PORT,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME,
});

// Exportamos a função 'query' para ser usada em toda a aplicação
module.exports = {
query: (text, params) => pool.query(text, params),
};