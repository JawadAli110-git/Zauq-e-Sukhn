const bcrypt = require('bcryptjs');
const { getDB } = require('../config/db');

// Convert a SQLite row → API-friendly object
const toUser = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    favorites: JSON.parse(row.favorites || '[]'),
    createdAt: row.created_at,
  };
};

const User = {
  findById(id) {
    const row = getDB().prepare('SELECT * FROM users WHERE id = ?').get(id);
    return toUser(row);
  },

  findOne({ email }) {
    const row = getDB().prepare('SELECT * FROM users WHERE email = ?').get(email);
    return toUser(row);
  },

  create({ name, email, password, role = 'user' }) {
    const hashed = bcrypt.hashSync(password, 10);
    const info = getDB()
      .prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
      .run(name, email.toLowerCase().trim(), hashed, role);
    return this.findById(info.lastInsertRowid);
  },

  updateFavorites(id, favorites) {
    getDB()
      .prepare('UPDATE users SET favorites = ? WHERE id = ?')
      .run(JSON.stringify(favorites), id);
    return this.findById(id);
  },

  comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compareSync(candidatePassword, hashedPassword);
  },

  updatePassword(id, newPassword) {
    const hashed = bcrypt.hashSync(newPassword, 10);
    getDB()
      .prepare('UPDATE users SET password = ? WHERE id = ?')
      .run(hashed, id);
    return this.findById(id);
  },

  setResetToken(id, token, expires) {
    getDB()
      .prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?')
      .run(token, expires, id);
  },

  findByResetToken(token) {
    const row = getDB()
      .prepare('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?')
      .get(token, Date.now());
    return toUser(row);
  },

  clearResetToken(id) {
    getDB()
      .prepare('UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?')
      .run(id);
  },
};

module.exports = User;
