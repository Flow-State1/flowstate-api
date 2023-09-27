const router = require("express").Router();
const publisherController = require("../controllers/publisherController");
const publisher = require("../config/MQTTConnection");
require("dotenv").config();
const toggle_switch1 = process.env.SWITCH_PUBLISHERTOPIC1.toString();
const switch_command1 = process.env.SWITCH_MESSAGE1.toString();
const toggle_switch2 = process.env.SWITCH_PUBLISHERTOPIC2.toString();
const switch_command2 = process.env.SWITCH_MESSAGE2.toString();
const switch_sub1 = process.env.SWITCH_SUBSCRIBERTOPIC1.toString();
const switch_sub2 = process.env.SWITCH_SUBSCRIBERTOPIC2.toString();

publisher.subscribe(switch_sub1);
publisher.subscribe(switch_sub2);

router.post("/", publisherController.publish_message_post);

router.post("/switch/1", (request, response) => {
  publisher.on("message", (topic,message) => {
    response.send(`${topic}\n${message}`);
  });
  publisher.publish(toggle_switch1, switch_command1);
});
router.post("/switch/2", (request, response) => {
  publisher.publish(toggle_switch2, switch_command2);
  response.sendStatus(200);
});


module.exports = router;
