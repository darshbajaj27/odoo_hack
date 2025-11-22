const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

router.get('/stats', authenticate, DashboardController.getStats);
router.get('/charts', authenticate, DashboardController.getCharts);
router.get('/recent-activity', authenticate, DashboardController.getRecentActivity);

module.exports = router;
