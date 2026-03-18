const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/admin/stats — admin only
router.get('/stats', auth, admin, (req, res) => {
  try {
    const db = getDB();
    const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const poetsCount = db.prepare('SELECT COUNT(*) as count FROM poets').get().count;
    const poetryCount = db.prepare('SELECT COUNT(*) as count FROM poetry').get().count;
    const coursesCount = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
    const qafiyaCount = db.prepare('SELECT COUNT(*) as count FROM qafiya').get().count;

    res.json({
      users: usersCount,
      poets: poetsCount,
      poetry: poetryCount,
      courses: coursesCount,
      qafiya: qafiyaCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
