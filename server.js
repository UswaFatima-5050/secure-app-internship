require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const db = require('./db');

const app = express();

// ─── SECURITY HEADERS + CSP + HSTS ───────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'"],
      imgSrc:     ["'self'"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// ─── CORS ─────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// ─── RATE LIMITING ────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Try again in 15 minutes.' }
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── API KEY AUTH MIDDLEWARE ──────────────────────────────
function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (key !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
  next();
}

// ─── SECURE ROUTE (API Key protected) ────────────────────
app.get('/api/data', requireApiKey, (req, res) => {
  res.json({ message: 'Secure data returned successfully.' });
});

// ─── VULNERABLE ROUTE for SQLMap testing (BEFORE FIX) ────
app.get('/api/user-vulnerable', (req, res) => {
  const id = req.query.id;
  db.all(`SELECT * FROM users WHERE id = ${id}`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ─── FIXED ROUTE (Prepared Statement) ────────────────────
app.get('/api/user', (req, res) => {
  const id = req.query.id;
  db.all('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ─── CSRF PROTECTED ROUTES ────────────────────────────────
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post('/submit', csrfProtection, (req, res) => {
  res.json({ status: 'Form submitted successfully with CSRF protection.' });
});

// ─── START SERVER ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Secure server running on http://localhost:${PORT}`);
});
