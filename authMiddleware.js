// authMiddleware.js
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  console.log('Cookies recebidos:', req.cookies);
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, name, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Apenas admin' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
