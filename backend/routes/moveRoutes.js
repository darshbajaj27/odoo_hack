const express = require('express');
const router = express.Router();
const moveController = require('../controllers/moveController');

router.get('/', moveController.getMoves);

module.exports = router;