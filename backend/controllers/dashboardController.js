const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    // Total products
    const totalProducts = await prisma.product.count();

    // Low stock alerts (products with onHand < 50)
    const lowStock = await prisma.product.count({
      where: {
        onHand: {
          lt: 50,
        },
      },
    });

    // Incoming receipts (RECEIPT type operations not DONE)
    const incoming = await prisma.operation.count({
      where: {
        type: 'RECEIPT',
        status: {
          notIn: ['DONE', 'CANCELLED'],
        },
      },
    });

    // Outgoing deliveries (DELIVERY type operations not DONE)
    const outgoing = await prisma.operation.count({
      where: {
        type: 'DELIVERY',
        status: {
          notIn: ['DONE', 'CANCELLED'],
        },
      },
    });

    res.json({
      totalProducts,
      lowStock,
      incoming,
      outgoing,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

// Get chart data (stock moves aggregated by week)
exports.getCharts = async (req, res) => {
  try {
    // Get operations from the last 5 weeks
    const fiveWeeksAgo = new Date();
    fiveWeeksAgo.setDate(fiveWeeksAgo.getDate() - 35);

    const operations = await prisma.operation.findMany({
      where: {
        scheduledDate: {
          gte: fiveWeeksAgo,
        },
        status: 'DONE',
      },
      include: {
        lines: true,
      },
    });

    // Group by week
    const weekData = {};
    operations.forEach((op) => {
      const weekStart = new Date(op.scheduledDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weekData[weekKey]) {
        weekData[weekKey] = 0;
      }

      // Count total quantity moved
      op.lines.forEach((line) => {
        weekData[weekKey] += line.doneQty;
      });
    });

    // Convert to array format
    const chartData = Object.keys(weekData)
      .sort()
      .slice(-5) // Last 5 weeks
      .map((date, index) => ({
        name: `Week ${index + 1}`,
        moves: Math.round(weekData[date] || 0),
      }));

    // Ensure we always have 5 weeks of data
    while (chartData.length < 5) {
      chartData.unshift({
        name: `Week ${chartData.length + 1}`,
        moves: 0,
      });
    }

    res.json(chartData);
  } catch (error) {
    console.error('Get charts error:', error);
    res.status(500).json({ message: 'Failed to fetch chart data' });
  }
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const recentOperations = await prisma.operation.findMany({
      take: 5,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        contact: true,
      },
    });

    // Format for frontend
    const activities = recentOperations.map((op) => ({
      id: op.id,
      action: getActivityAction(op.type, op.status),
      time: getRelativeTime(op.updatedAt),
      icon: getActivityIcon(op.type),
      ref: op.ref,
      contact: op.contact?.name,
    }));

    res.json(activities);
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ message: 'Failed to fetch recent activity' });
  }
};

// Helper functions
function getActivityAction(type, status) {
  const actions = {
    RECEIPT: 'Receipt',
    DELIVERY: 'Delivery',
    INTERNAL: 'Internal Transfer',
    ADJUSTMENT: 'Stock Adjustment',
  };

  const statusText = {
    DRAFT: 'Created',
    WAITING: 'Waiting',
    READY: 'Ready',
    DONE: 'Validated',
    CANCELLED: 'Cancelled',
  };

  return `${actions[type] || type} ${statusText[status] || status}`;
}

function getActivityIcon(type) {
  const icons = {
    RECEIPT: 'Truck',
    DELIVERY: 'Send',
    INTERNAL: 'Box',
    ADJUSTMENT: 'Box',
  };

  return icons[type] || 'Box';
}

function getRelativeTime(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000); // seconds

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}