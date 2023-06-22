var mqtt = require('mqtt');
require('dotenv').config()

var options = {
    
    host: process.env.HOST,
    port: process.env.PRT,
    protocol: process.env.PROTOCOL,
    username: process.env.UID,
    password: process.env.PASSWORD
}

var client = mqtt.connect(options);


client.on('connect', function () {
    console.log('Connected to mqtt');
});

client.on('error', function (error) {

// Disconnect from the MQTT server
function disconnectFromMqtt() {
    client.end((error) => {
      if (error) {
        console.error('Error occurred while disconnecting from MQTT server:', error);
      } else {
        console.log('Disconnected from MQTT server');
      }
    });
  }
  // Call the disconnect function when you want to disconnect
  disconnectFromMqtt();
});

module.exports = client;