var mqtt = require('mqtt');

var options = {
    
    host: 'cc0c0d711929454a9a6978569baa3c03.s2.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'dswfullstack',
    password: 'FullstackDSW2023'
}

var client = mqtt.connect(options);


client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

module.exports = client;