const express = require('express');
const router = express.Router();
const moveController = require('../controllers/moveController');
const { authenticate } = require('../middleware/auth'); 

// GET /api/moves - Get Flattened History for UI
// Matches: static async getHistory(req, res)
router.get('/', authenticate, moveController.getHistory);

module.exports = router;