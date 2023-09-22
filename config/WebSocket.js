const WebSocket = require('ws');
const MQTTClient = require('./MQTTConnection');
require("dotenv").config()
const mqtt_message = JSON.stringify(process.env.MESSAGE1);
const Consumptions = require('../models/consumption');

const CreateWebSocketServer  = (server,port)=>{
    const WebSocketServer = new WebSocket.Server({server});

    console.log("Web socket listening on ",port);

    //Check for connection to web socket
    WebSocketServer.on('connection',(ws)=>{
        
        console.log("New Client Connected to Web Socket Server");
        
        //Send MQTT messages via websocket, whenever the api receives messages from the device
            MQTTClient.on('message',(topic,message)=>{

                //Send messages to all the devices that are connected to the web socket server
                WebSocketServer.clients.forEach(function each(client) {
                    if (client === ws && client.readyState === WebSocket.OPEN) {
                        let parsedMessage;
                        try {
                            //Parse the incoming messages to json format
                            parsedMessage = JSON.parse(message);
                            //let src = parsedMessage.src;
                        } catch (error) {
                            console.error('Error parsing MQTT message:', error);
                            return;
                        }

                        //Instance of the Consumption model, parsing data to be saved in the database
                        const newConsumption = new Consumptions({
                            topic: topic,
                            payload: JSON.stringify(parsedMessage)
                        });

                        // //Save the new consumption instance to the database
                        // newConsumption.save().then((savedConsumption) => {
                        //     console.log('Saved consumptions to database: ', savedConsumption);
                        // })

                        client.send(message.toString());
                    }
                    else{
                        console.log("Clients websockets not open");
                    }
                });
            })

            //Add the websocket server as a subscriver to the topics of both devices
            MQTTClient.subscribe(process.env.SUBSCRIBERTOPIC1.toString());
            MQTTClient.subscribe(process.env.SUBSCRIBERTOPIC2.toString());
        
    })

    WebSocketServer.on('close',(ws)=>{
        console.log("client disconnected");
    })



}

module.exports = CreateWebSocketServer;