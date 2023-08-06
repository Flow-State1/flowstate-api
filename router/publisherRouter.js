const router = require('express').Router();
const publisherController = require('../controllers/publisherController');
const publisher = require('../config/MQTTConnection');
require("dotenv").config();
const toggle_switch1 = process.env.SWITCH_PUBLISHERTOPIC1.toString();
const switch_command1 = process.env.SWITCH_MESSAGE1.toString();
const toggle_switch2 = process.env.SWITCH_PUBLISHERTOPIC2.toString();
const switch_command2 = process.env.SWITCH_MESSAGE2.toString();

router.post('/',publisherController.publish_message_post);
router.post('/switch/1',(request,response)=>{
    publisher.publish(toggle_switch1,switch_command1);
    response.sendStatus(200);
})
router.post('/switch/2',(request,response)=>{
    publisher.publish(toggle_switch2,switch_command2);
    response.sendStatus(200);
})

module.exports = router;