# Sistema de Gerenciamento de Restaurante

Aplicação web para gestão de um restaurante, permitindo controlar pedidos, mesas, cardápio, garçons, estoque e relatórios financeiros.  
O sistema segue o modelo **SPA + API**: o frontend roda no navegador e consome uma API backend em Node.js/Express com autenticação e gestão de usuários.

## Visão Geral da Arquitetura

- **Frontend (SPA)**
  - HTML + CSS + JavaScript puro.
  - Navegação por abas (Pedidos, Mesas, Cardápio, Garçons, Estoque, Relatórios, Usuários).
  - Estado de negócio armazenado em `localStorage` (mesas, pedidos, cardápio, estoque e garçons).
  - Autenticação integrada com a API via `fetch` e cookies (JWT em cookie HttpOnly).

- **Backend (API)**
  - Node.js + Express.
  - Banco SQLite (arquivo `database.sqlite`) gerenciado via `sqlite3`.
  - Tabela `users` com senhas hasheadas em `password_hash` usando `bcryptjs`.
  - Autenticação via **JWT** armazenado em cookie `token` (`HttpOnly`, `SameSite=Lax`).
  - Middlewares `requireAuth` e `requireAdmin` protegem rotas sensíveis.

## Tecnologias Utilizadas

- **Frontend**
  - HTML5, CSS3
  - JavaScript (SPA simples, sem framework)
  - LocalStorage para persistência local

- **Backend**
  - Node.js, Express
  - SQLite (`sqlite3`)
  - bcryptjs, jsonwebtoken
  - cookie-parser, cors, dotenv

## Estrutura de Pastas

/
css/
base.css
layout.css
components-main.css
modal-mesas.css
relatorio.css
user-auth-ui.css
print.css
login-style.css

js/
auth.js # autenticação frontend, sessão e tela de usuários (admin)
storage.js # salvar/carregar dados no localStorage
core.js # bootstrap do app (carrega dados, inicializa telas)
nav.js # navegação entre abas
mesa.js # gestão de mesas + modal de detalhes
cardapio.js # CRUD local de itens do cardápio
pedidos.js # renderização e remoção de pedidos
estoque.js # CRUD local de estoque
relatorios.js # relatórios e estatísticas
garcons.js # gestão de garçons, ranking e comissões

projeto/
login.html # tela de login (SPA inicia aqui)
index.html # SPA principal do sistema

db.js # conexão SQLite e criação da tabela users + admin padrão
authMiddleware.js # middlewares requireAuth / requireAdmin
server.js # servidor Express e registro das rotas
routes/
auth.js # rotas de autenticação e usuários
.env # variáveis de ambiente (não versionado)
package.json
database.sqlite # banco gerado em tempo de execução

text

## Como Executar

### 1. Backend (API Node/Express)

Pré‑requisitos: Node.js instalado.

Instale as dependências na raiz do projeto:

npm install

text

Crie um arquivo `.env` na raiz:

JWT_SECRET=um_segredo_muito_seguros123
PORT=3000

text

Inicie o servidor:

node server.js

text

Ao iniciar, o backend:

- Cria o arquivo `database.sqlite` (se não existir).
- Cria o usuário admin padrão
