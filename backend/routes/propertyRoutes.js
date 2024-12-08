const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.get('/properties', propertyController.getAllProperties);
router.post('/properties', propertyController.createProperty);

// Add more routes as needed (e.g., update, delete)

module.exports = router;