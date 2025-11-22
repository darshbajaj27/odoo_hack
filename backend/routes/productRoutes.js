const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

router.get('/', authenticate, ProductController.getAll);
router.get('/:id', authenticate, ProductController.getById);
router.post('/', authenticate, validateProduct('create'), ProductController.create);
router.put('/:id', authenticate, validateProduct('update'), ProductController.update);
router.delete('/:id', authenticate, ProductController.delete);

module.exports = router;
