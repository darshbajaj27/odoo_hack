const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const { parsePagination, getPaginationMeta } = require('../utils/helpers');

const prisma = new PrismaClient();

class OperationController {
  /**
   * Get all operations
   * GET /api/operations
   */
  static async getAll(req, res) {
    try {
      const { status, type, productId } = req.query;
      const { page, limit, skip } = parsePagination(req.query);

      const where = {};
      if (status) where.status = status;
      if (type) where.type = type;
      if (productId) where.productId = productId;

      const [operations, total] = await Promise.all([
        prisma.operation.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                category: true,
              },
            },
            fromLocation: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            toLocation: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        prisma.operation.count({ where }),
      ]);

      res.json({
        operations,
        pagination: getPaginationMeta(total, page, limit),
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
          fromLocation: {
            include: {
              warehouse: true,
            },
          },
          toLocation: {
            include: {
              warehouse: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
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
      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Verify locations exist if provided
      if (fromLocationId) {
        const fromLocation = await prisma.location.findUnique({
          where: { id: fromLocationId },
        });
        if (!fromLocation) {
          return res.status(404).json({ error: 'From location not found' });
        }
      }

      if (toLocationId) {
        const toLocation = await prisma.location.findUnique({
          where: { id: toLocationId },
        });
        if (!toLocation) {
          return res.status(404).json({ error: 'To location not found' });
        }
      }

      const operation = await prisma.operation.create({
        data: {
          productId,
          quantity: parseInt(quantity),
          type,
          fromLocationId: fromLocationId || null,
          toLocationId: toLocationId || null,
          status: 'PENDING',
          notes,
          userId: req.user.userId,
        },
        include: {
          product: true,
          fromLocation: true,
          toLocation: true,
        },
      });

      logger.info(`Operation created: ${operation.id} by user ${req.user.userId}`);

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
          notes: notes !== undefined ? notes : undefined,
        },
        include: {
          product: true,
          fromLocation: true,
          toLocation: true,
        },
      });

      logger.info(`Operation updated: ${operation.id} by user ${req.user.userId}`);

      res.json(operation);
    } catch (error) {
      logger.error('Update operation error:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Operation not found' });
      }
      
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
        include: {
          product: true,
        },
      });

      // If operation is completed, update product quantity
      if (status === 'COMPLETED') {
        const quantityChange = operation.type === 'OUTBOUND' 
          ? -operation.quantity 
          : operation.quantity;

        await prisma.product.update({
          where: { id: operation.productId },
          data: {
            quantity: {
              increment: quantityChange,
            },
          },
        });
      }

      logger.info(`Operation status updated: ${operation.id} -> ${status} by user ${req.user.userId}`);

      res.json(operation);
    } catch (error) {
      logger.error('Update operation status error:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Operation not found' });
      }
      
      res.status(500).json({ error: 'Failed to update operation status' });
    }
  }

  /**
   * Update operation lines (for bulk operations)
   * PUT /api/operations/:id/lines
   */
  static async updateOperationLines(req, res) {
    const { lines } = req.body;

    try {
      // Implementation for bulk line updates
      // This is a placeholder for complex multi-line operations
      
      res.json({ message: 'Operation lines updated successfully', lines });
    } catch (error) {
      logger.error('Update operation lines error:', error);
      res.status(500).json({ error: 'Failed to update operation lines' });
    }
  }

  /**
   * Delete operation
   * DELETE /api/operations/:id
   */
  static async delete(req, res) {
    try {
      const operation = await prisma.operation.findUnique({
        where: { id: req.params.id },
      });

      if (!operation) {
        return res.status(404).json({ error: 'Operation not found' });
      }

      // Only allow deletion of PENDING operations
      if (operation.status !== 'PENDING') {
        return res.status(400).json({ 
          error: 'Only pending operations can be deleted' 
        });
      }

      await prisma.operation.delete({
        where: { id: req.params.id },
      });

      logger.info(`Operation deleted: ${req.params.id} by user ${req.user.userId}`);

      res.json({ message: 'Operation deleted successfully' });
    } catch (error) {
      logger.error('Delete operation error:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Operation not found' });
      }
      
      res.status(500).json({ error: 'Failed to delete operation' });
    }
  }
}

module.exports = OperationController;