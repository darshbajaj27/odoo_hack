const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const { parsePagination, getPaginationMeta } = require('../utils/helpers'); // Keep team's helpers

const prisma = new PrismaClient();

class OperationController {
  /**
   * Get all operations (History) with advanced filtering
   * GET /api/operations 
   */
  static async getAll(req, res) {
    try {
      const { status, type, search } = req.query;
      // Use team's pagination logic
      const { page, limit, skip } = parsePagination(req.query);

      const where = {};
      if (status) where.status = status;
      if (type) where.type = type;
      
      // Enhanced Search (Product Name or SKU inside lines)
      if (search) {
        where.OR = [
          { id: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
          { lines: { some: { product: { name: { contains: search, mode: 'insensitive' } } } } }
        ];
      }

      const [operations, total] = await Promise.all([
        prisma.operation.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            // Deep includes (Team's requirement)
            lines: {
              include: {
                product: { select: { id: true, name: true, sku: true, category: true } }
              }
            },
            sourceLocation: { select: { id: true, name: true, type: true } },
            destinationLocation: { select: { id: true, name: true, type: true } },
            contact: { select: { id: true, name: true } },
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
          lines: { include: { product: true } },
          sourceLocation: { include: { parentWarehouse: true } },
          destinationLocation: { include: { parentWarehouse: true } },
          contact: true,
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
   * Create operation (TRANSACTIONAL)
   * POST /api/operations
   */
  static async create(req, res) {
    // Note: Using SKU is safer than ID for barcode workflows
    const { sku, quantity, type, fromLocationId, toLocationId, notes } = req.body;

    try {
      // 1. Validation
      if (!quantity || quantity <= 0) return res.status(400).json({ error: "Quantity must be positive" });

      // 2. Verify Product
      const product = await prisma.product.findUnique({ where: { sku } });
      if (!product) return res.status(404).json({ error: 'Product not found' });

      // 3. Run Transaction (The "Real" Move)
      const operation = await prisma.$transaction(async (tx) => {
        
        // A. Create Ledger Entry
        const op = await tx.operation.create({
          data: {
            id: `OP-${Date.now()}`,
            type,
            status: 'DONE', // Auto-complete
            scheduledDate: new Date(),
            notes,
            sourceLocationId: fromLocationId ? parseInt(fromLocationId) : null,
            destinationLocationId: toLocationId ? parseInt(toLocationId) : null,
            
            // Correctly use 'lines' relation
            lines: {
              create: {
                productId: product.id,
                demandQty: parseFloat(quantity),
                doneQty: parseFloat(quantity)
              }
            }
          },
          include: { lines: true }
        });

        // B. Update Stock at DESTINATION
        if (toLocationId) {
          await OperationController._upsertStock(tx, product.id, parseInt(toLocationId), parseFloat(quantity));
        }

        // C. Update Stock at SOURCE (if Internal/Delivery)
        if (fromLocationId) {
          await OperationController._upsertStock(tx, product.id, parseInt(fromLocationId), -parseFloat(quantity));
        }

        // D. Update Product Global "On Hand"
        await OperationController._updateProductTotal(tx, product.id);

        return op;
      });

      logger.info(`Operation created: ${operation.id}`);
      res.status(201).json(operation);

    } catch (error) {
      logger.error('Create operation error:', error);
      res.status(500).json({ error: error.message || 'Failed to create operation' });
    }
  }

  // --- HELPER METHODS (Keep these!) ---
  
  static async _upsertStock(tx, productId, locationId, change) {
    const existing = await tx.stockItem.findUnique({
      where: { productId_locationId: { productId, locationId } }
    });

    if (existing) {
      const newQty = existing.quantity + change;
      if (newQty < 0) throw new Error(`Insufficient stock at Location ID ${locationId}`);
      await tx.stockItem.update({
        where: { id: existing.id },
        data: { quantity: newQty }
      });
    } else {
      if (change < 0) throw new Error(`Cannot take stock from empty location ${locationId}`);
      await tx.stockItem.create({
        data: { productId, locationId, quantity: change }
      });
    }
  }

  static async _updateProductTotal(tx, productId) {
    const allItems = await tx.stockItem.findMany({ where: { productId } });
    const total = allItems.reduce((sum, item) => sum + item.quantity, 0);
    await tx.product.update({
      where: { id: productId },
      data: { onHand: total }
    });
  }

  /**
   * Delete operation (Restricted)
   */
  static async delete(req, res) {
    try {
      const op = await prisma.operation.findUnique({ where: { id: req.params.id } });
      if (!op) return res.status(404).json({ error: 'Operation not found' });

      // Only allow delete if DRAFT. DONE operations are immutable history.
      if (op.status !== 'DRAFT') {
        return res.status(400).json({ error: 'Cannot delete completed operations. They are part of the ledger.' });
      }

      await prisma.operation.delete({ where: { id: req.params.id } });
      res.json({ message: 'Operation deleted successfully' });
    } catch (error) {
      logger.error('Delete operation error:', error);
      res.status(500).json({ error: 'Failed to delete operation' });
    }
  }
}

module.exports = OperationController;