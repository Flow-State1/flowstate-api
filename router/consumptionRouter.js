const router = require('express').Router();
const authController = require('./../controllers/authController');
const consumptionController = require('../controllers/consumptionController');

router.get('/',consumptionController.getAllConsumptions);
router.get('/1',consumptionController.getAllConsumptions1);
router.get('/2',consumptionController.getAllConsumptions2);
router.get('/device1',consumptionController.getConsumption1)
router.get('/device2',consumptionController.getConsumption2)
router.get('/:date',consumptionController.getConsumptiondate)

module.exports = router;
