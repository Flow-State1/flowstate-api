const router = require('express').Router();
const imageController = require('../controllers/profileImageController');

router.post('/',imageController.uploadImage);


module.exports = router;
