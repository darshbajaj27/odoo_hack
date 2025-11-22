const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, SearchController.globalSearch);
router.get('/products', authenticate, SearchController.searchProducts);

module.exports = router;
