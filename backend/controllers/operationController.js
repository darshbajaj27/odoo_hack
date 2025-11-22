const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

class OperationController {
  /**
   * Get all operations
   * GET /api/operations
   */
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, status, type } = req.query;

      const where = {};
      if (status) where.status = status;
      if (type) where.type = type;

      const operations = await prisma.operation.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          product: true,
          fromLocation: true,
          toLocation: true,
          user: true,
        },
      });

      const total = await prisma.operation.count({ where });

      res.json({
        operations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error('Get operations error:', error);
      res.status(500).json({ error: 'Failed to fetch operations' });
    }
  }

  /**
   * Get single operation
   * GET /api/operations/:id
   */
  static async getById(req, res) {
    try {
      const operation = await prisma.operation.findUnique({
        where: { id: req.params.id },
        include: {
          product: true,
          fromLocation: true,
          toLocation: true,
          user: true,
        },
      });

      if (!operation) {
        return res.status(404).json({ error: 'Operation not found' });
      }

      res.json(operation);
    } catch (error) {
      logger.error('Get operation error:', error);
      res.status(500).json({ error: 'Failed to fetch operation' });
    }
  }

  /**
   * Create operation
   * POST /api/operations
   */
  static async create(req, res) {
    const { productId, quantity, type, fromLocationId, toLocationId, notes } = req.body;

    try {
      const operation = await prisma.operation.create({
        data: {
          productId,
          quantity: parseInt(quantity),
          type,
          fromLocationId: fromLocationId || null,
          toLocationId: toLocationId || null,
          status: 'PENDING',
          notes,
          userId: req.user.id,
        },
        include: {
          product: true,
          fromLocation: true,
          toLocation: true,
        },
      });

      logger.info(`Operation created: ${operation.id}`);

      res.status(201).json(operation);
    } catch (error) {
      logger.error('Create operation error:', error);
      res.status(500).json({ error: 'Failed to create operation' });
    }
  }

  /**
   * Update operation
   * PUT /api/operations/:id
   */
  static async update(req, res) {
    const { productId, quantity, type, fromLocationId, toLocationId, notes } = req.body;

    try {
      const operation = await prisma.operation.update({
        where: { id: req.params.id },
        data: {
          productId: productId || undefined,
          quantity: quantity ? parseInt(quantity) : undefined,
          type: type || undefined,
          fromLocationId: fromLocationId || undefined,
          toLocationId: toLocationId || undefined,
          notes: notes || undefined,
        },
        include: {
          product: true,
          fromLocation: true,
          toLocation: true,
        },
      });

      logger.info(`Operation updated: ${operation.id}`);

      res.json(operation);
    } catch (error) {
      logger.error('Update operation error:', error);
      res.status(500).json({ error: 'Failed to update operation' });
    }
  }

  /**
   * Update operation status
   * PATCH /api/operations/:id/status
   */
  static async updateStatus(req, res) {
    const { status } = req.body;

    try {
      const operation = await prisma.operation.update({
        where: { id: req.params.id },
        data: { status },
      });

      logger.info(`Operation status updated: ${operation.id} -> ${status}`);

      res.json(operation);
    } catch (error) {
      logger.error('Update operation status error:', error);
      res.status(500).json({ error: 'Failed to update operation status' });
    }
  }

  /**
   * Delete operation
   * DELETE /api/operations/:id
   */
  static async delete(req, res) {
    try {
      await prisma.operation.delete({
        where: { id: req.params.id },
      });

      logger.info(`Operation deleted: ${req.params.id}`);

      res.json({ message: 'Operation deleted successfully' });
    } catch (error) {
      logger.error('Delete operation error:', error);
      res.status(500).json({ error: 'Failed to delete operation' });
    }
  }
}

module.exports = OperationController;
