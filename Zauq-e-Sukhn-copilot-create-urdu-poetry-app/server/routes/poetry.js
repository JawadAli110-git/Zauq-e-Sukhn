const express = require('express');
const router = express.Router();
const Poetry = require('../models/Poetry');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/poetry
router.get('/', (req, res) => {
  try {
    const opts = {
      type: req.query.type || null,
      poetId: req.query.poet || null,
      featured: req.query.featured === 'true',
      limit: parseInt(req.query.limit) || 0,
    };
    res.json(Poetry.find(opts));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/poetry/featured  (must be before /:id)
router.get('/featured', (req, res) => {
  try {
    res.json(Poetry.find({ featured: true }));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/poetry/:id
router.get('/:id', (req, res) => {
  try {
    const poem = Poetry.incrementView(req.params.id);
    if (!poem) return res.status(404).json({ message: 'Poetry not found' });
    res.json(poem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/poetry — admin only
router.post('/', auth, admin, (req, res) => {
  try {
    const poem = Poetry.create(req.body);
    res.status(201).json(poem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/poetry/:id — admin only
router.put('/:id', auth, admin, (req, res) => {
  try {
    const poem = Poetry.update(req.params.id, req.body);
    if (!poem) return res.status(404).json({ message: 'Poetry not found' });
    res.json(poem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/poetry/:id — admin only
router.delete('/:id', auth, admin, (req, res) => {
  try {
    const poem = Poetry.delete(req.params.id);
    if (!poem) return res.status(404).json({ message: 'Poetry not found' });
    res.json({ message: 'Poetry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/poetry/:id/favorite — toggle favorite
router.post('/:id/favorite', auth, (req, res) => {
  try {
    const user = User.findById(req.user._id);
    const poetryId = parseInt(req.params.id);
    const favs = user.favorites || [];
    const idx = favs.indexOf(poetryId);
    if (idx === -1) {
      favs.push(poetryId);
    } else {
      favs.splice(idx, 1);
    }
    const updated = User.updateFavorites(user.id, favs);
    res.json({ favorites: updated.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
