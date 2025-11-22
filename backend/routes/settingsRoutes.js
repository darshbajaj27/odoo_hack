const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settingsController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateSettings } = require('../middleware/validation');

// Warehouses
router.get('/warehouses', authenticate, SettingsController.getWarehouses);
router.post(
  '/warehouses',
  authenticate,
  authorize('ADMIN'),
  validateSettings('warehouse'),
  SettingsController.createWarehouse
);

// Locations
router.get('/locations', authenticate, SettingsController.getLocations);
router.post(
  '/locations',
  authenticate,
  authorize('ADMIN'),
  validateSettings('location'),
  SettingsController.createLocation
);

// Users
router.get('/users', authenticate, authorize('ADMIN'), SettingsController.getUsers);
router.put(
  '/users/:id',
  authenticate,
  authorize('ADMIN'),
  validateSettings('userRole'),
  SettingsController.updateUserRole
);

// Contacts
router.get('/contacts', authenticate, SettingsController.getContacts);
router.post(
  '/contacts',
  authenticate,
  validateSettings('contact'),
  SettingsController.createContact
);

module.exports = router;
