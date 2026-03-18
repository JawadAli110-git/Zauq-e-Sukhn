const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendResetCodeEmail } = require('../config/email');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      const existing = User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already exists with this email' });

      const user = User.create({ name, email, password });
      const token = generateToken(user.id);
      res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = User.comparePassword(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = generateToken(user.id);
      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    try {
      const user = User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: 'No account found with this email address. Please register first.',
        });
      }

      // Generate a secure random 6-digit code
      const token = crypto.randomInt(100000, 999999).toString();
      const expires = Date.now() + 15 * 60 * 1000; // 15 minutes

      User.setResetToken(user.id, token, expires);

      // Attempt to send the code via email
      const emailSent = await sendResetCodeEmail(email, token);

      if (emailSent) {
        console.log(`[Password Reset] Code emailed to ${email}`);
        res.json({
          message: 'A reset code has been sent to your email address.',
          emailSent: true,
        });
      } else {
        // Fallback: email not configured — return code in response (dev mode)
        console.log(`[Password Reset] Email not configured. Code for ${email}: ${token}`);
        res.json({
          message: 'Email service not configured. Here is your reset code (dev mode):',
          emailSent: false,
          resetToken: token,
        });
      }
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { token, password } = req.body;
    try {
      const user = User.findByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      User.updatePassword(user.id, password);
      User.clearResetToken(user.id);

      res.json({ message: 'Password has been reset successfully. You can now log in.' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

module.exports = router;
