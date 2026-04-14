const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
const morgan     = require('morgan');
const path       = require('path');
require('dotenv').config();

// Route imports
const authRoutes      = require('./routes/auth.routes');
const passRoutes      = require('./routes/pass.routes');
const conductorRoutes = require('./routes/conductor.routes');
const routeRoutes     = require('./routes/route.routes');
const paymentRoutes   = require('./routes/payment.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const transportRoutes = require('./routes/transportRoutes');
const systemRoutes    = require('./routes/systemRoutes');
const institutionRoutes = require('./routes/institution.routes');


const { setupSocketIO } = require('./utils/socketHandler');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', methods: ['GET', 'POST'] },
});

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/passes',     passRoutes);
app.use('/api/conductor',  conductorRoutes);
app.use('/api/routes',     routeRoutes);
app.use('/api/payments',   paymentRoutes);
app.use('/api/analytics',  analyticsRoutes);
app.use('/api/transport',  transportRoutes);
app.use('/api/system',     systemRoutes);
app.use('/api/institutions', institutionRoutes);


// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: '🚌 BusPass API running', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error.' });
});

// ─── Socket.IO ───────────────────────────────────────────────
setupSocketIO(io);

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚌 BusPass Backend running at http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready for live tracking`);
  console.log(`🗄️  Database: ${process.env.DB_NAME}@${process.env.DB_HOST}\n`);
});
