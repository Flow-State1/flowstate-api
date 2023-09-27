const router = require("express").Router();
const appliencesController = require('../controllers/appliencesController');
const authController = require('../controllers/authController');

router.get('/appliences', appliencesController.getAllAppliences);

module.exports = router;
