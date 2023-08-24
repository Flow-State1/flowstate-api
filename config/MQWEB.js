const WebSocket = require('ws');
const MQTTClient = require('./MQTTConnection');
require("dotenv").config()
const mqtt_message = JSON.stringify(process.env.MESSAGE1)

const CreateWebSocketServer  = (server,port) => {

    const WebSocketServer = new WebSocket.Server({server});

    console.log("Web socket listening on ",port);

    //Check for connection to web socket
    WebSocketServer.on('connection',(ws)=>{
        
        console.log("New Client Connected to Web Socket Server");
        
        //Handle messages sent to server
        ws.on('message',(message)=>{
            // console.log("Message from client: ",message.toString());
            //Receive the messages that were published to the mqtt server under the message the client is subscribed to
            MQTTClient.on('message',(topic,message)=>{
                // console.log("MQTT Working");
                // console.log(message);
                //Send the received mqtt payload to all the clients that are connected to the websocket server
                WebSocketServer.clients.forEach(function each(client) {
                    // console.log(client);
                    if (client === ws && client.readyState === WebSocket.OPEN) {
                    //   client.send(`${message.toString()}`);
                        console.log(`{topic:${topic.toString()},\npayload:${message.toString()}}`);
                    }
                    else{
                        console.log("Clients websockets not open");
                    }
                });
            })

            // console.log(`Publishing:\ntopic:${process.env.TOPIC1}\n${mqtt_message}`);
            //Publish and subscrirbe
            MQTTClient.publish(
                process.env.PUBLISHERTOPIC2.toString(),
                process.env.MESSAGE2.toString()
            );
            MQTTClient.subscribe(process.env.SUBSCRIBERTOPIC1.toString());
        })
        
    })
    WebSocketServer.on('close',(ws)=>{
        console.log("client disconnected");
    })
};

module.exports = CreateWebSocketServer;