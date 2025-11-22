const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const { parsePagination, getPaginationMeta } = require('../utils/helpers');

const prisma = new PrismaClient();

class MoveController {
  /**
   * Get move history (flattened operations)
   * GET /api/moves
   */
  static async getHistory(req, res) {
    try {
      const { productId, type, startDate, endDate, status } = req.query;
      const { page, limit, skip } = parsePagination(req.query);

      const where = {};
      if (productId) where.productId = productId;
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
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
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
                email: true,
              },
            },
          },
        }),
        prisma.operation.count({ where }),
      ]);

      // Flatten operations to move history format
      const moveHistory = moves.map((move) => ({
        id: move.id,
        date: move.createdAt,
        product: move.product.name,
        productId: move.productId,
        productSku: move.product.sku,
        quantity: move.quantity,
        type: move.type,
        fromLocation: move.fromLocation?.name || 'N/A',
        toLocation: move.toLocation?.name || 'N/A',
        status: move.status,
        user: move.user ? `${move.user.firstName} ${move.user.lastName}` : 'N/A',
        notes: move.notes,
      }));

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
      const [totalMoves, movesByType, movesByStatus, recentMoves] = await Promise.all([
        prisma.operation.count(),
        prisma.operation.groupBy({
          by: ['type'],
          _count: true,
        }),
        prisma.operation.groupBy({
          by: ['status'],
          _count: true,
        }),
        prisma.operation.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
      ]);

      res.json({
        totalMoves,
        recentMoves,
        movesByType: movesByType.map((m) => ({
          type: m.type,
          count: m._count,
        })),
        movesByStatus: movesByStatus.map((m) => ({
          status: m.status,
          count: m._count,
        })),
      });
    } catch (error) {
      logger.error('Get move stats error:', error);
      res.status(500).json({ error: 'Failed to fetch move statistics' });
    }
  }
}

module.exports = MoveController;