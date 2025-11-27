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

## 📁 Estrutura de Pastas

```text
/
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── components-main.css
│   ├── modal-mesas.css
│   ├── relatorio.css
│   ├── user-auth-ui.css
│   ├── print.css
│   └── login-style.css
│
├── js/
│   ├── auth.js          # Autenticação frontend + gestão de usuários
│   ├── storage.js       # Persistência em localStorage
│   ├── core.js          # Bootstrap do app
│   ├── nav.js           # Navegação SPA
│   ├── mesa.js          # Gestão de mesas
│   ├── cardapio.js      # CRUD de cardápio
│   ├── pedidos.js       # Gestão de pedidos
│   ├── estoque.js       # CRUD do estoque
│   ├── relatorios.js    # Relatórios e estatísticas
│   └── garcons.js       # Gestão de garçons + ranking/comissões
│
├── projeto/
│   ├── login.html       # Tela de login
│   └── index.html       # SPA principal
│
├── routes/
│   └── auth.js          # Rotas de autenticação e usuários
│
├── authMiddleware.js     # requireAuth / requireAdmin
├── db.js                 # Conexão SQLite + criação do admin
├── server.js             # Servidor Express
├── package.json
├── .env                  # Variáveis de ambiente (não versionado)
└── database.sqlite       # Banco gerado automaticamente


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
