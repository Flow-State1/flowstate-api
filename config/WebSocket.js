const WebSocket = require('ws');
const MQTTClient = require('./MQTTConnection');
require("dotenv").config()

const CreateWebSocketServer  = (server,port)=>{
    const WebSocketServer = new WebSocket.Server({server});

    //Check for connection to web socket
    WebSocketServer.on('connection',(ws)=>{
        console.log("New Client Connected to Web Socket Server");
        
        //Handle messages sent to server
        ws.on('message',(message)=>{
            let msgObj = message.toString();
            let json = JSON.parse(msgObj);
            let mqtt_topic = json.topic;

            //Receive the messages that were published to the mqtt server under the message the client is subscribed to
            MQTTClient.on('message',(topic,message)=>{

                //Send the received mqtt payload to all the clients that are connected to the websocket server
                WebSocketServer.clients.forEach(function each(client) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                      client.send(`{topic:${topic.toString()},\npayload:${message.toString()}}`);
                    }
                });
            })

            //Publish and subscrirbe
            MQTTClient.publish(
                process.env.TOPIC1,
                process.env.MESSAGE1
            );
            MQTTClient.subscribe(mqtt_topic);
        })
        
    })

    WebSocketServer.on('close',(ws)=>{
        console.log("client disconnected");
    })



}

module.exports = CreateWebSocketServer;