require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: "https://zauq-e-sukhn-backend.onrender.com",
  credentials: true
}));
app.use(express.json());

// Rate limiting — protect all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // max 200 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Stricter limiter for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait 15 minutes and try again.' },
});

// Connect to SQLite (synchronous — tables created immediately)
connectDB();

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/poets', require('./routes/poets'));
app.use('/api/poetry', require('./routes/poetry'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/qafiya', require('./routes/qafiya'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Zauq-e-Sukhn API', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found', 
    path: req.path,
    method: req.method 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()}: ${err.message}`);
  console.error(err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({ 
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Zauq-e-Sukhn server running on port ${PORT}`));

module.exports = app;
