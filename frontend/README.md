(PriceScout)


O projeto "Radar de Ofertas" é um sistema focado no monitoramento de preços de um conjunto pré-definido de 5 notebooks. A plataforma permite que usuários se cadastrem, "sigam" um ou mais desses notebooks e definam um preço-alvo.

O sistema é construído com uma API de backend em Node.js e um frontend em React, e utiliza workers de web scraping (Puppeteer) para descobrir e monitorar ofertas em tempo real.

Tecnologias Utilizadas
Backend
Node.js

Express.js (Servidor da API)

PostgreSQL (Banco de dados)

pg (Driver Node.js para Postgres)

jsonwebtoken (Para autenticação JWT)

bcryptjs (Para hash de senhas)

cors (Para permitir comunicação com o frontend)

dotenv (Para gerenciar variáveis de ambiente)

Frontend
React (com Vite)

react-router-dom (Para gerenciamento de rotas/páginas)

axios (Para fazer requisições à API)

React Context API (Para gerenciamento de estado de autenticação)

Pré-requisitos
Antes de começar, garanta que você tem os seguintes softwares instalados dentro do seu ambiente WSL (Ubuntu):

VS Code com a extensão WSL instalada.

Node.js: Recomendado v20+ (LTS). A forma mais fácil de instalar é via NVM.

PostgreSQL:

Bash

sudo apt update
sudo apt install postgresql postgresql-contrib
Instalação e Configuração
Siga estes passos para configurar o ambiente de desenvolvimento.

1. Configuração do Banco de Dados (PostgreSQL)
Execute estes comandos no seu terminal WSL:

Bash

# 1. Inicie o serviço do Postgres
sudo service postgresql start

# 2. Acesse o psql como superusuário
sudo -u postgres psql

# 3. Crie um usuário (role) para a aplicação. Troque 'sua_senha_segura' por uma senha real.
CREATE ROLE radar_admin LOGIN PASSWORD 'sua_senha_segura';

# 4. Crie o banco de dados e defina seu usuário como dono
CREATE DATABASE radar_db OWNER radar_admin;

# 5. Saia do psql
\q
2. Configuração do Backend (API)
Bash

# 1. Navegue até a pasta do backend
cd backend

# 2. Instale todas as dependências do Node.js
npm install

# 3. Crie o arquivo de variáveis de ambiente
# (Este comando cria uma cópia do arquivo de exemplo)
cp .env.example .env

# 4. Edite o arquivo .env com suas credenciais do banco
# Abra o arquivo 'backend/.env' e preencha com os dados do Passo 1:
#
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=radar_admin
# DB_PASSWORD=sua_senha_segura  <-- A senha que você criou
# DB_NAME=radar_db
# JWT_SECRET=um_segredo_muito_forte_para_seu_token

# 5. Edite o script de inicialização do banco
# IMPORTANTE: Abra o arquivo 'backend/init-db.js'.
# Na linha 'const connectionString = ...', atualize a senha para ser
# a mesma que você colocou no .env.

# 6. Rode o script para criar as tabelas no banco de dados
node init-db.js
(Se o passo 6 for bem-sucedido, você verá mensagens de "Tabelas criadas com sucesso!")

3. Configuração do Frontend (React)
Bash

# 1. Volte para a raiz e entre na pasta do frontend
cd ../frontend

# 2. Instale todas as dependências do React
npm install
Como Rodar a Aplicação
Para rodar o projeto, você precisará de dois terminais abertos, pois o frontend e o backend são servidores separados.

Terminal 1: Rodar o Backend
Bash

# Estando na pasta raiz do projeto
cd backend
npm run dev
O backend estará rodando em http://localhost:3001.

Terminal 2: Rodar o Frontend
Bash

# Estando na pasta raiz do projeto
cd frontend
npm run dev
O frontend estará rodando em http://localhost:5173.

Acesso
Abra o seu navegador (Chrome, Edge, etc.) e acesse: http://localhost:5173