const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('express-async-errors');

const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const operationRoutes = require('./routes/operationRoutes');
const productRoutes = require('./routes/productRoutes');
const moveRoutes = require('./routes/moveRoutes');
const searchRoutes = require('./routes/searchRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Middleware
app.use(cors(require('./config/cors')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/moves', moveRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = app;
