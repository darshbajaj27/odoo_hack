const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth'); 

router.get('/', authenticate, productController.getProducts);
router.get('/categories', authenticate, productController.getCategories);
router.get('/:id', authenticate, productController.getProductById);
router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;