const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const { parsePagination, getPaginationMeta } = require('../utils/helpers');

const prisma = new PrismaClient();

class MoveController {
  /**
   * Get move history (ADAPTER: Maps new Schema to Old Frontend format)
   * GET /api/moves
   */
  static async getHistory(req, res) {
    try {
      const { type, status, startDate, endDate } = req.query;
      const { page, limit, skip } = parsePagination(req.query);

      const where = {};
      if (type) where.type = type;
      if (status) where.status = status;

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const [moves, total] = await Promise.all([
        prisma.operation.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            // NEW SCHEMA: Product is inside lines
            lines: {
              include: {
                product: {
                  select: { id: true, name: true, sku: true }
                }
              }
            },
            sourceLocation: { select: { id: true, name: true } },
            destinationLocation: { select: { id: true, name: true } },
            user: { select: { id: true, name: true, email: true } },
          },
        }),
        prisma.operation.count({ where }),
      ]);

      // TRANSFORM: Flatten the data so the Frontend doesn't break
      const moveHistory = moves.map((move) => {
        // Grab the first product from the lines (assuming single-product moves for now)
        const lineItem = move.lines[0] || {}; 
        const product = lineItem.product || { name: 'Unknown', sku: 'N/A' };

        return {
          id: move.id,
          date: move.createdAt,
          // Map nested data to top-level fields (What Frontend Expects)
          product: product.name,
          productId: product.id,
          productSku: product.sku,
          quantity: lineItem.demandQty || 0,
          type: move.type,
          fromLocation: move.sourceLocation?.name || 'N/A',
          toLocation: move.destinationLocation?.name || 'N/A',
          status: move.status,
          user: move.user ? move.user.name : 'System',
          notes: move.notes,
        };
      });

      res.json({
        moves: moveHistory,
        pagination: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      logger.error('Get move history error:', error);
      res.status(500).json({ error: 'Failed to fetch move history' });
    }
  }

  /**
   * Get move statistics
   * GET /api/moves/stats
   */
  static async getStats(req, res) {
    try {
      const [totalMoves, movesByType, movesByStatus] = await Promise.all([
        prisma.operation.count(),
        prisma.operation.groupBy({ by: ['type'], _count: true }),
        prisma.operation.groupBy({ by: ['status'], _count: true }),
      ]);

      res.json({
        totalMoves,
        movesByType: movesByType.map((m) => ({ type: m.type, count: m._count })),
        movesByStatus: movesByStatus.map((m) => ({ status: m.status, count: m._count })),
      });
    } catch (error) {
      logger.error('Get move stats error:', error);
      res.status(500).json({ error: 'Failed to fetch move statistics' });
    }
  }
}

module.exports = MoveController;