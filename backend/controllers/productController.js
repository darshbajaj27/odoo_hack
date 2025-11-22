const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all products with pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      order = 'asc',
      search,
      category,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    // Get total count
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy]: order,
      },
    });

    res.json({
      data: products,
      meta: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        operationLines: {
          include: {
            operation: true,
          },
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      category,
      costPrice = 0,
      sellingPrice = 0,
      onHand = 0,
      freeToUse = 0,
    } = req.body;

    if (!sku || !name || !category) {
      return res.status(400).json({ message: 'SKU, name, and category are required' });
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        category,
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
        onHand: parseFloat(onHand),
        freeToUse: parseFloat(freeToUse),
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove id and timestamps from update data
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Convert numeric fields
    if (updateData.costPrice) updateData.costPrice = parseFloat(updateData.costPrice);
    if (updateData.sellingPrice) updateData.sellingPrice = parseFloat(updateData.sellingPrice);
    if (updateData.onHand) updateData.onHand = parseFloat(updateData.onHand);
    if (updateData.freeToUse) updateData.freeToUse = parseFloat(updateData.freeToUse);

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product is used in any operation lines
    const usedInOperations = await prisma.operationLine.count({
      where: { productId: parseInt(id) },
    });

    if (usedInOperations > 0) {
      return res.status(400).json({
        message: 'Cannot delete product that is used in operations',
      });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// Get product categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      distinct: ['category'],
      select: {
        category: true,
      },
    });

    res.json(categories.map((c) => c.category));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};