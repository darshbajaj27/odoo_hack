const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ===== WAREHOUSES =====

// Get all warehouses
exports.getWarehouses = async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        _count: {
          select: { locations: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(warehouses);
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({ message: 'Failed to fetch warehouses' });
  }
};

// Create warehouse
exports.createWarehouse = async (req, res) => {
  try {
    const { name, shortCode, address } = req.body;

    if (!name || !shortCode || !address) {
      return res.status(400).json({ message: 'Name, short code, and address are required' });
    }

    // Check if short code already exists
    const existing = await prisma.warehouse.findUnique({
      where: { shortCode },
    });

    if (existing) {
      return res.status(400).json({ message: 'Short code already exists' });
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        shortCode,
        address,
      },
    });

    res.status(201).json(warehouse);
  } catch (error) {
    console.error('Create warehouse error:', error);
    res.status(500).json({ message: 'Failed to create warehouse' });
  }
};

// Update warehouse
exports.updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortCode, address } = req.body;

    const warehouse = await prisma.warehouse.update({
      where: { id: parseInt(id) },
      data: {
        name,
        shortCode,
        address,
      },
    });

    res.json(warehouse);
  } catch (error) {
    console.error('Update warehouse error:', error);
    res.status(500).json({ message: 'Failed to update warehouse' });
  }
};

// Delete warehouse
exports.deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if warehouse has locations
    const locationCount = await prisma.location.count({
      where: { parentWarehouseId: parseInt(id) },
    });

    if (locationCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete warehouse that has locations',
      });
    }

    await prisma.warehouse.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    console.error('Delete warehouse error:', error);
    res.status(500).json({ message: 'Failed to delete warehouse' });
  }
};

// ===== LOCATIONS =====

// Get all locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      include: {
        parentWarehouse: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(locations);
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Failed to fetch locations' });
  }
};

// Create location
exports.createLocation = async (req, res) => {
  try {
    const { name, type, parentWarehouseId } = req.body;

    if (!name || !type || !parentWarehouseId) {
      return res.status(400).json({ message: 'Name, type, and parent warehouse are required' });
    }

    const location = await prisma.location.create({
      data: {
        name,
        type,
        parentWarehouseId: parseInt(parentWarehouseId),
      },
      include: {
        parentWarehouse: true,
      },
    });

    res.status(201).json(location);
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ message: 'Failed to create location' });
  }
};

// Update location
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, parentWarehouseId } = req.body;

    const location = await prisma.location.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
        parentWarehouseId: parentWarehouseId ? parseInt(parentWarehouseId) : undefined,
      },
      include: {
        parentWarehouse: true,
      },
    });

    res.json(location);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Failed to update location' });
  }
};

// Delete location
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if location is used in operations
    const operationCount = await prisma.operation.count({
      where: {
        OR: [
          { sourceLocationId: parseInt(id) },
          { destinationLocationId: parseInt(id) },
        ],
      },
    });

    if (operationCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete location that is used in operations',
      });
    }

    await prisma.location.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ message: 'Failed to delete location' });
  }
};

// ===== USERS =====

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, status } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        role,
        status,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// ===== CONTACTS =====

// Get all contacts
exports.getContacts = async (req, res) => {
  try {
    const { type } = req.query;

    const where = type ? { type } : {};

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });

    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};

// Create contact
exports.createContact = async (req, res) => {
  try {
    const { name, type, email } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        type,
        email,
      },
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ message: 'Failed to create contact' });
  }
};