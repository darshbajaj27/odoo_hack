// ===== controllers/searchController.js =====

// Global search across products and operations
exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({
        products: [],
        operations: [],
      });
    }

    const searchTerm = q.trim();

    // Search products
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { sku: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        onHand: true,
      },
    });

    // Search operations
    const operations = await prisma.operation.findMany({
      where: {
        OR: [
          { ref: { contains: searchTerm, mode: 'insensitive' } },
          { sourceDocument: { contains: searchTerm, mode: 'insensitive' } },
          { contact: { name: { contains: searchTerm, mode: 'insensitive' } } },
        ],
      },
      take: 5,
      include: {
        contact: true,
      },
      select: {
        id: true,
        ref: true,
        type: true,
        status: true,
        scheduledDate: true,
        contact: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      products,
      operations: operations.map((op) => ({
        id: op.id,
        ref: op.ref,
        type: op.type,
        status: op.status,
        date: op.scheduledDate,
        contact: op.contact?.name,
      })),
    });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};