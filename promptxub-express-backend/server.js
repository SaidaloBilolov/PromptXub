require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for production platforms like Vercel / Render / Heroku (HTTPS forwarding)
app.set('trust proxy', 1);

// Middleware: CORS Configuration
const allowedOrigins = [
  'https://prompt-xub.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow for mobile / tools in dev
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware: Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: Express Session Management
app.use(session({
  secret: process.env.SESSION_SECRET || 'promptxub_express_oauth_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production', // true for HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Initialize Passport & Session Support
app.use(passport.initialize());
app.use(passport.session());

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'PromptXub Node.js Express Google OAuth Service',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes
app.use('/', authRoutes);
app.use('/auth', authRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Express Server Error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Node.js Express OAuth Server running on port ${PORT}`);
  console.log(`🔗 Google Callback URL: ${process.env.GOOGLE_CALLBACK_URL}`);
  console.log(`==================================================`);
});
