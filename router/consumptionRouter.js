const router = require('express').Router();
const authController = require('./../controllers/authController');
const consumptionController = require('../controllers/consumptionController');

router.get('/', authController.protect, consumptionController.getAllConsumptions);

module.exports = router;
