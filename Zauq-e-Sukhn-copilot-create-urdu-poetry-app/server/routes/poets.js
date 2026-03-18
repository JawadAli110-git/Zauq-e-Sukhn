const express = require('express');
const router = express.Router();
const Poet = require('../models/Poet');
const Poetry = require('../models/Poetry');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/poets
router.get('/', (req, res) => {
  try {
    res.json(Poet.findAll());
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/poets/:id
router.get('/:id', (req, res) => {
  try {
    const poet = Poet.findById(req.params.id);
    if (!poet || !poet.isActive) return res.status(404).json({ message: 'Poet not found' });
    // Include the poet's poetry so the detail page can show counts & content
    const poetry = Poetry.findByPoet(req.params.id);
    res.json({ ...poet, poetry });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/poets — admin only
router.post('/', auth, admin, (req, res) => {
  try {
    const poet = Poet.create(req.body);
    res.status(201).json(poet);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/poets/:id — admin only
router.put('/:id', auth, admin, (req, res) => {
  try {
    const poet = Poet.update(req.params.id, req.body);
    if (!poet) return res.status(404).json({ message: 'Poet not found' });
    res.json(poet);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/poets/:id — admin only (soft delete)
router.delete('/:id', auth, admin, (req, res) => {
  try {
    const poet = Poet.softDelete(req.params.id);
    if (!poet) return res.status(404).json({ message: 'Poet not found' });
    res.json({ message: 'Poet deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/poets/:id/poetry
router.get('/:id/poetry', (req, res) => {
  try {
    res.json(Poetry.findByPoet(req.params.id));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
