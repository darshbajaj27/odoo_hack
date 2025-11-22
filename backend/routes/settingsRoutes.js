const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Warehouses
router.get('/warehouses', settingsController.getWarehouses);
router.post('/warehouses', settingsController.createWarehouse);
router.put('/warehouses/:id', settingsController.updateWarehouse);
router.delete('/warehouses/:id', settingsController.deleteWarehouse);

// Locations
router.get('/locations', settingsController.getLocations);
router.post('/locations', settingsController.createLocation);
router.put('/locations/:id', settingsController.updateLocation);
router.delete('/locations/:id', settingsController.deleteLocation);

// Users
router.get('/users', settingsController.getUsers);
router.put('/users/:id', settingsController.updateUser);

// Contacts
router.get('/contacts', settingsController.getContacts);
router.post('/contacts', settingsController.createContact);

module.exports = router;