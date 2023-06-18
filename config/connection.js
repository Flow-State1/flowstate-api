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
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

module.exports = client;