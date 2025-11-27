// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// inicializa tabela users
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'user'))
    )
  `);

  // cria usuário admin padrão se não existir
  db.get('SELECT * FROM users WHERE email = ?', ['admin@local'], (err, row) => {
    if (err) {
      console.error('Erro ao verificar admin:', err);
      return;
    }
    if (!row) {
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync('admin123', 10);
      db.run(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Administrador', 'admin@local', hash, 'admin'],
        err2 => {
          if (err2) console.error('Erro ao criar admin:', err2);
          else console.log('Usuário admin criado: admin@local / admin123');
        }
      );
    }
  });
});

module.exports = db;
