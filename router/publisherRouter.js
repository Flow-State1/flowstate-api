const router = require('express').Router();
const publisherController = require('../controllers/publisherController');

router.post('/',publisherController.publish_message_post);

module.exports = router;