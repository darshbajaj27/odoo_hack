const express = require('express');
const router = express.Router();
const operationController = require('../controllers/operationController');

router.get('/', operationController.getOperations);
router.get('/:id', operationController.getOperationById);
router.post('/', operationController.createOperation);
router.put('/:id', operationController.updateOperationStatus);
router.put('/:id/lines', operationController.updateOperationLines);
router.delete('/:id', operationController.deleteOperation);

module.exports = router;