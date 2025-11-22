const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.getStats);
router.get('/charts', dashboardController.getCharts);
router.get('/recent-activity', dashboardController.getRecentActivity);
module.exports = router;