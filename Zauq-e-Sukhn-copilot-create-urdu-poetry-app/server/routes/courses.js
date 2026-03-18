const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/courses
router.get('/', (req, res) => {
  try {
    res.json(Course.findAll());
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/courses/:id
router.get('/:id', (req, res) => {
  try {
    const course = Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/courses — admin only
router.post('/', auth, admin, (req, res) => {
  try {
    const course = Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/courses/:id — admin only
router.put('/:id', auth, admin, (req, res) => {
  try {
    const course = Course.update(req.params.id, req.body);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/courses/:id — admin only
router.delete('/:id', auth, admin, (req, res) => {
  try {
    const course = Course.delete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
