const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

class ProductController {
  
  // GET /api/products
  static async getProducts(req, res) {
    try {
      const { page = 1, limit = 10, sortBy = 'name', order = 'asc', search, category } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (category) where.category = category;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: order }, // Keep Team's Sorting
          include: {
            // CRITICAL: Show where the stock is located (Shelf/Rack)
            stockItems: {
              include: { location: true }
            }
          }
        }),
        prisma.product.count({ where })
      ]);

      // Calculate total stock dynamically to be safe
      const formatted = products.map(p => ({
        ...p,
        realStock: p.stockItems.reduce((sum, item) => sum + item.quantity, 0)
      }));

      res.json({
        data: formatted,
        meta: {
          total,
          page: parseInt(page),
          totalPages: Math.ceil(total / take),
        },
      });
    } catch (error) {
      logger.error('Get products error:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  }

  // GET /api/products/:id
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: {
          // Include Stock Levels per Location
          stockItems: {
            include: { location: true }
          },
          // Include History (via Lines)
          operationLines: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { operation: true }
          }
        },
      });

      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      logger.error('Get product error:', error);
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  }

  // POST /api/products (Keep logic, just ensure ID consistency)
  static async createProduct(req, res) {
    try {
      const { sku, name, category, price } = req.body;
      
      // Check existing
      const existing = await prisma.product.findUnique({ where: { sku } });
      if (existing) return res.status(400).json({ message: 'SKU already exists' });

      const product = await prisma.product.create({
        data: {
          sku,
          name,
          category,
          sellingPrice: parseFloat(price || 0),
          onHand: 0, // Start at 0. Use "Receipt" operation to add stock.
        },
      });

      res.status(201).json(product);
    } catch (error) {
      logger.error('Create product error:', error);
      res.status(500).json({ message: 'Failed to create product' });
    }
  }

  // Update Product (Keep Team's logic mostly)
  static async updateProduct(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Protect ID/Dates
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        // Protect onHand (must use operations)
        delete updateData.onHand; 

        if (updateData.sellingPrice) updateData.sellingPrice = parseFloat(updateData.sellingPrice);

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        res.json(product);
    } catch (error) {
        logger.error('Update product error:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }
  }

  // Delete Product (Added Safety Check)
  static async deleteProduct(req, res) {
    try {
        const { id } = req.params;
        
        // Safety: Don't delete if stock exists
        const product = await prisma.product.findUnique({ 
            where: { id: parseInt(id) },
            include: { stockItems: true }
        });
        
        const hasStock = product?.stockItems.some(item => item.quantity > 0);
        if (hasStock) return res.status(400).json({ message: "Cannot delete product with active stock." });

        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        logger.error('Delete product error:', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
  }
  
  // Get Categories (Keep Team's logic)
  static async getCategories(req, res) {
    try {
        const categories = await prisma.product.findMany({
            distinct: ['category'],
            select: { category: true },
        });
        res.json(categories.map((c) => c.category));
    } catch (error) {
        logger.error('Get categories error:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
  }
}

module.exports = ProductController;