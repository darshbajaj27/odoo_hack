const express = require('express');
const router = express.Router();
const OperationController = require('../controllers/operationController');
const { authenticate } = require('../middleware/auth');
const { validateOperation } = require('../middleware/validation');

router.get('/', authenticate, OperationController.getAll);
router.get('/:id', authenticate, OperationController.getById);
router.post('/', authenticate, validateOperation('create'), OperationController.create);
router.put('/:id', authenticate, validateOperation('update'), OperationController.update);
router.patch('/:id/status', authenticate, validateOperation('updateStatus'), OperationController.updateStatus);
router.delete('/:id', authenticate, OperationController.delete);

module.exports = router;
