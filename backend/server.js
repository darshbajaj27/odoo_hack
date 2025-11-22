const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('express-async-errors'); // Handles async errors automatically

const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler'); // Use your existing error handler

// Routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes');
const operationRoutes = require('./routes/operationRoutes');
const moveRoutes = require('./routes/moveRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Professional Request Logging
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/moves', moveRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler (Must be last)
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});



const PORT = process.env.PORT || 5000;

// ONLY start the server if this file is run directly (node server.js)
// Do NOT start it if it's imported by a test
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📊 API available at http://localhost:${PORT}/api`);
  });
}

module.exports = app; // Export app for testing