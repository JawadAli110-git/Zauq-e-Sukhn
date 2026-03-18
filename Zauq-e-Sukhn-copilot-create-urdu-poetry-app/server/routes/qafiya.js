const express = require('express');
const router = express.Router();
const Qafiya = require('../models/Qafiya');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/qafiya
router.get('/', (req, res) => {
  try {
    res.json(Qafiya.findAll(req.query.search));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/qafiya/search/:query — must be before /:id
router.get('/search/:query', (req, res) => {
  try {
    res.json(Qafiya.search(req.params.query));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/qafiya/:id
router.get('/:id', (req, res) => {
  try {
    const entry = Qafiya.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Qafiya entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/qafiya — admin only
router.post('/', auth, admin, (req, res) => {
  try {
    const entry = Qafiya.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/qafiya/:id — admin only
router.put('/:id', auth, admin, (req, res) => {
  try {
    const entry = Qafiya.update(req.params.id, req.body);
    if (!entry) return res.status(404).json({ message: 'Qafiya entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/qafiya/:id — admin only
router.delete('/:id', auth, admin, (req, res) => {
  try {
    const entry = Qafiya.delete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Qafiya entry not found' });
    res.json({ message: 'Qafiya entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
