const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

class SearchController {
  /**
   * Global search across products and operations
   * GET /api/search?q=query
   */
  static async globalSearch(req, res) {
    try {
      const { q, type = 'all', limit = 20 } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({ error: 'Query must be at least 2 characters' });
      }

      const searchQuery = {
        mode: 'insensitive',
        contains: q,
      };

      let results = {
        products: [],
        operations: [],
      };

      if (type === 'all' || type === 'products') {
        results.products = await prisma.product.findMany({
          where: {
            OR: [
              { name: searchQuery },
              { sku: searchQuery },
              { description: searchQuery },
              { category: searchQuery },
            ],
          },
          take: parseInt(limit),
          select: {
            id: true,
            name: true,
            sku: true,
            category: true,
            quantity: true,
          },
        });
      }

      if (type === 'all' || type === 'operations') {
        results.operations = await prisma.operation.findMany({
          where: {
            OR: [
              { product: { name: searchQuery } },
              { product: { sku: searchQuery } },
              { notes: searchQuery },
            ],
          },
          take: parseInt(limit),
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        });
      }

      res.json({
        query: q,
        results,
        totalResults: results.products.length + results.operations.length,
      });
    } catch (error) {
      logger.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  }

  /**
   * Search products only
   * GET /api/search/products?q=query
   */
  static async searchProducts(req, res) {
    try {
      const { q, limit = 20 } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({ error: 'Query must be at least 2 characters' });
      }

      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { sku: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: parseInt(limit),
      });

      res.json({
        query: q,
        results: products,
        totalResults: products.length,
      });
    } catch (error) {
      logger.error('Product search error:', error);
      res.status(500).json({ error: 'Product search failed' });
    }
  }
}

module.exports = SearchController;
