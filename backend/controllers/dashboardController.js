const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

class DashboardController {
  /**
   * Get dashboard statistics
   * GET /api/dashboard/stats
   */
  static async getStats(req, res) {
    try {
      const totalProducts = await prisma.product.count();
      const totalOperations = await prisma.operation.count();
      const activeWarehouses = await prisma.warehouse.count({
        where: { isActive: true },
      });

      const stats = {
        totalProducts,
        totalOperations,
        activeWarehouses,
        totalLocations: await prisma.location.count(),
        lowStockProducts: await prisma.product.count({
          where: { quantity: { lte: 10 } },
        }),
      };

      res.json(stats);
    } catch (error) {
      logger.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  }

  /**
   * Get chart data
   * GET /api/dashboard/charts
   */
  static async getCharts(req, res) {
    try {
      // TODO: Implement chart data aggregation
      const chartData = {
        productsByCategory: [],
        operationsByType: [],
        stockTrends: [],
      };

      res.json(chartData);
    } catch (error) {
      logger.error('Get charts error:', error);
      res.status(500).json({ error: 'Failed to fetch chart data' });
    }
  }

  /**
   * Get recent activity
   * GET /api/dashboard/recent-activity
   */
  static async getRecentActivity(req, res) {
    try {
      const recentOperations = await prisma.operation.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          product: true,
          fromLocation: true,
          toLocation: true,
        },
      });

      res.json({
        recentOperations,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Get recent activity error:', error);
      res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
  }
}

module.exports = DashboardController;
