const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

class ProductController {
  /**
   * Get all products
   * GET /api/products
   */
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, category, search } = req.query;

      const where = {};
      if (category) where.category = category;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          locations: true,
        },
      });

      const total = await prisma.product.count({ where });

      res.json({
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  /**
   * Get single product
   * GET /api/products/:id
   */
  static async getById(req, res) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: req.params.id },
        include: {
          locations: true,
          operations: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      logger.error('Get product error:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  /**
   * Create product
   * POST /api/products
   */
  static async create(req, res) {
    const { name, sku, description, category, price, quantity, reorderLevel } = req.body;

    try {
      const product = await prisma.product.create({
        data: {
          name,
          sku,
          description,
          category,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          reorderLevel: parseInt(reorderLevel),
        },
      });

      logger.info(`Product created: ${product.id}`);

      res.status(201).json(product);
    } catch (error) {
      logger.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  /**
   * Update product
   * PUT /api/products/:id
   */
  static async update(req, res) {
    const { name, sku, description, category, price, quantity, reorderLevel } = req.body;

    try {
      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: {
          name: name || undefined,
          sku: sku || undefined,
          description: description || undefined,
          category: category || undefined,
          price: price ? parseFloat(price) : undefined,
          quantity: quantity ? parseInt(quantity) : undefined,
          reorderLevel: reorderLevel ? parseInt(reorderLevel) : undefined,
        },
      });

      logger.info(`Product updated: ${product.id}`);

      res.json(product);
    } catch (error) {
      logger.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  /**
   * Delete product
   * DELETE /api/products/:id
   */
  static async delete(req, res) {
    try {
      await prisma.product.delete({
        where: { id: req.params.id },
      });

      logger.info(`Product deleted: ${req.params.id}`);

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      logger.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
}

module.exports = ProductController;
