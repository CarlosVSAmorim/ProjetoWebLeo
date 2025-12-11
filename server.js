// server.js
console.log('Iniciando server.js...');
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('./db'); // inicializa banco e admin

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// rotas de autenticação
app.use('/api/auth', authRoutes);

// healthcheck simples
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
