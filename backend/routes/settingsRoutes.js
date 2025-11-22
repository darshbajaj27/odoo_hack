const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticate } = require('../middleware/auth'); // <--- Import this

// Warehouses
router.get('/warehouses', authenticate, settingsController.getWarehouses);
router.post('/warehouses', authenticate, settingsController.createWarehouse);
router.put('/warehouses/:id', authenticate, settingsController.updateWarehouse);
router.delete('/warehouses/:id', authenticate, settingsController.deleteWarehouse);

// Locations
router.get('/locations', authenticate, settingsController.getLocations);
router.post('/locations', authenticate, settingsController.createLocation);
router.put('/locations/:id', authenticate, settingsController.updateLocation);
router.delete('/locations/:id', authenticate, settingsController.deleteLocation);

// Users
router.get('/users', authenticate, settingsController.getUsers);
router.put('/users/:id', authenticate, settingsController.updateUser);

// Contacts
router.get('/contacts', authenticate, settingsController.getContacts);
router.post('/contacts', authenticate, settingsController.createContact);

module.exports = router;