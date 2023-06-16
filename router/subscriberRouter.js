const router = require("express").Router();
const subscriberController = require('../controllers/subscriberController');

router.get("/",subscriberController.subscriber_get_all);

module.exports = router;
