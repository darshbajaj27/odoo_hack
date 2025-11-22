const express = require('express');
const router = express.Router();
const operationController = require('../controllers/operationController');
// We assume auth middleware exists in your boilerplate
const { authenticate } = require('../middleware/auth'); 

// GET /api/operations - Get History
// Matches: static async getAll(req, res)
router.get('/', authenticate, operationController.getAll);

// GET /api/operations/:id - Get Single Details
// Matches: static async getById(req, res)
router.get('/:id', authenticate, operationController.getById);

// POST /api/operations - Create New Move (Receipt/Delivery)
// Matches: static async create(req, res)
router.post('/', authenticate, operationController.create);

// DELETE /api/operations/:id - Delete (Draft only)
// Matches: static async delete(req, res)
router.delete('/:id', authenticate, operationController.delete);

module.exports = router;