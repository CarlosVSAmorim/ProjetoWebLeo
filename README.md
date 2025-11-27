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
auth.js
storage.js
core.js
nav.js
mesa.js
cardapio.js
pedidos.js
estoque.js
relatorios.js
garcons.js

projeto/
login.html
index.html

routes/
auth.js

db.js
authMiddleware.js
server.js
package.json
.env
database.sqlite (gerado em tempo de execução)

text
undefined


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
