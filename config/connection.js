var mqtt = require('mqtt');

var options = {
    
    host: 'c0be5116b67041dba39c40b7a8b38ad3.s2.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'refentse1',
    password: 'Refentse25'
}

var client = mqtt.connect(options);


client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

module.exports = client;