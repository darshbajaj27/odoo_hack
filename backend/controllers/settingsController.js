const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

class SettingsController {
  /**
   * Get all warehouses
   * GET /api/settings/warehouses
   */
  static async getWarehouses(req, res) {
    try {
      const warehouses = await prisma.warehouse.findMany({
        include: {
          locations: true,
        },
      });

      res.json(warehouses);
    } catch (error) {
      logger.error('Get warehouses error:', error);
      res.status(500).json({ error: 'Failed to fetch warehouses' });
    }
  }

  /**
   * Create warehouse
   * POST /api/settings/warehouses
   */
  static async createWarehouse(req, res) {
    const { name, code, address, city, state, zipCode, country } = req.body;

    try {
      const warehouse = await prisma.warehouse.create({
        data: {
          name,
          code,
          address,
          city,
          state,
          zipCode,
          country,
          isActive: true,
        },
      });

      logger.info(`Warehouse created: ${warehouse.id}`);

      res.status(201).json(warehouse);
    } catch (error) {
      logger.error('Create warehouse error:', error);
      res.status(500).json({ error: 'Failed to create warehouse' });
    }
  }

  /**
   * Get all locations
   * GET /api/settings/locations
   */
  static async getLocations(req, res) {
    try {
      const locations = await prisma.location.findMany({
        include: {
          warehouse: true,
        },
      });

      res.json(locations);
    } catch (error) {
      logger.error('Get locations error:', error);
      res.status(500).json({ error: 'Failed to fetch locations' });
    }
  }

  /**
   * Create location
   * POST /api/settings/locations
   */
  static async createLocation(req, res) {
    const { name, code, warehouseId, aisle, rack, shelf } = req.body;

    try {
      const location = await prisma.location.create({
        data: {
          name,
          code,
          warehouseId,
          aisle,
          rack,
          shelf,
          isActive: true,
        },
      });

      logger.info(`Location created: ${location.id}`);

      res.status(201).json(location);
    } catch (error) {
      logger.error('Create location error:', error);
      res.status(500).json({ error: 'Failed to create location' });
    }
  }

  /**
   * Get all users
   * GET /api/settings/users
   */
  static async getUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      res.json(users);
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  /**
   * Update user role
   * PUT /api/settings/users/:id
   */
  static async updateUserRole(req, res) {
    const { role } = req.body;

    try {
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { role },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      logger.info(`User role updated: ${user.id} -> ${role}`);

      res.json(user);
    } catch (error) {
      logger.error('Update user role error:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  }

  /**
   * Get all contacts
   * GET /api/settings/contacts
   */
  static async getContacts(req, res) {
    try {
      const contacts = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
      });

      res.json(contacts);
    } catch (error) {
      logger.error('Get contacts error:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  }

  /**
   * Create contact
   * POST /api/settings/contacts
   */
  static async createContact(req, res) {
    const { name, email, phone, company, type } = req.body;

    try {
      const contact = await prisma.contact.create({
        data: {
          name,
          email,
          phone,
          company,
          type,
        },
      });

      logger.info(`Contact created: ${contact.id}`);

      res.status(201).json(contact);
    } catch (error) {
      logger.error('Create contact error:', error);
      res.status(500).json({ error: 'Failed to create contact' });
    }
  }
}

module.exports = SettingsController;
