const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth'); // <--- Import this

router.get('/stats', authenticate, dashboardController.getStats);
router.get('/charts', authenticate, dashboardController.getCharts);
router.get('/recent-activity', authenticate, dashboardController.getRecentActivity);

module.exports = router;