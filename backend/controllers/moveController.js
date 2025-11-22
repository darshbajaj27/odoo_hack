const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

class MoveController {
  /**
   * Get move history (flattened operations)
   * GET /api/moves
   */
  static async getHistory(req, res) {
    try {
      const { page = 1, limit = 10, productId, type, startDate, endDate, status } = req.query;

      const where = {};
      if (productId) where.productId = productId;
      if (type) where.type = type;
      if (status) where.status = status;

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const moves = await prisma.operation.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          product: true,
          fromLocation: true,
          toLocation: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      const total = await prisma.operation.count({ where });

      // Flatten operations to move history format
      const moveHistory = moves.map((move) => ({
        id: move.id,
        date: move.createdAt,
        product: move.product.name,
        productId: move.productId,
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
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
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
      const totalMoves = await prisma.operation.count();
      const movesByType = await prisma.operation.groupBy({
        by: ['type'],
        _count: true,
      });

      res.json({
        totalMoves,
        movesByType: movesByType.map((m) => ({
          type: m.type,
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
