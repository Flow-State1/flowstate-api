const router = require('express').Router();
const publisherController = require('../controllers/publisherController');
const publisher = require('../config/MQTTConnection');
require("dotenv").config();
const toggle_switch = process.env.SWITCH_PUBLISHERTOPIC1.toString();
const switch_command = process.env.SWITCH_MESSAGE1.toString();

router.post('/',publisherController.publish_message_post);
router.post('/switch',(request,response)=>{
    publisher.publish(toggle_switch,switch_command);
    response.sendStatus(200);
})

module.exports = router;