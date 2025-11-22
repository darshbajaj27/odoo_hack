const express = require('express');
const router = express.Router();
const MoveController = require('../controllers/moveController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, MoveController.getHistory);
router.get('/stats', authenticate, MoveController.getStats);

module.exports = router;
