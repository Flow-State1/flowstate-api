//const WebSocket = require("ws");
const MQTTClient = require("./MQTTConnection");
require("dotenv").config();
const Payloads = require("../models/Payload");
const fs = require("fs");
const { log } = require("console");
let user_id = "";

const { Server } = require("socket.io");

const CreateWebSocketServer = async (server, port) => {
  //const WebSocketServer = new WebSocket.Server({ server });

  const WebSocketServer = new Server(server);

  console.log("Web socket listening on ", port);
  let date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let stored_minute = "00";
  stored_minute =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  let stored_hour =
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  let topic1 = 0;
  let topic2 = 0;
  let devices = [];
  let count = 0;

  const onConnection = (ws) => {
    console.log("New Client Connected to Web Socket Server");
    ws.on("message", (messaage) => {
      console.log(messaage);
    });
    function readUserFileAndProcess(callback) {
      if (fs.existsSync("./data/user.txt")) {
        fs.readFile("./data/user.txt", (err, data) => {
          if (err) {
            console.error("Error reading file:", err);
            callback(err);
            return;
          }

          user_id = data.toString().trim();
          console.log("User with id2: ", user_id);

          callback(null); // Indicate success
        });
      } else {
        console.log("File not present, meaning no user, logged in");
      }
    }
    console.log("User with id2: ", user_id);
    readUserFileAndProcess(async (err) => {
      if (err) {
        console.error("Error processing file:", err);
        return;
      }
      MQTTClient.on("message", async (topic, message) => {
        // This checks if user was created

        // This reads from the devices file
        function readFileAndProcess(callback) {
          if (fs.existsSync("./data/devices.txt")) {
            fs.readFile("./data/devices.txt", (err, data) => {
              if (err) {
                console.error("Error reading file:", err);
                callback(err);
                return;
              }

              let processed_data = data.toString().trim().split("\n");

              if (processed_data.length > 0) {
                processed_data.forEach((element) => {
                  if (element != "" && count != 2) {
                    let device_object = JSON.parse(element);
                    devices.push(device_object);
                    count++;
                  }
                });
              } else {
                console.log("No devices registered");
              }

              callback(null); // Indicate success
            });
          } else {
            console.log("File not present, meaning no device is registered");
          }
        }

        // Call the function and pass a callback
        readFileAndProcess(async (err) => {
          if (err) {
            console.error("Error processing file:", err);
            return;
          }
          //   console.log("Devices file results: ", devices);

          let shelly1 = devices[0];
          let shelly2 = devices[1];
          // console.log("Currently Received Topic:", topic);
          let current = new Date();
          let current_minute =
            current.getMinutes() < 10
              ? `0${current.getMinutes()}`
              : current.getMinutes();

          let current_hour =
            current.getHours() < 10
              ? `0${current.getHours()}`
              : current.getHours();

          
            // {"id":"Shelly.GetStatus","src":"shellyplus1pm-a8032ab11964","dst":"devices/shellyplus1pm-a8032ab11964/messages/events",
            // "result":{"ble":{},"cloud":{"connected":false},
            // "input:0":{"id":0,"state":false},"mqtt":{"connected":true},"script:1":{"id":1, "running":true},
            // "switch:0":{"id":0, "source":"mqtt", "output":false, "apower":0.0, "voltage":237.7, "current":0.000,
            // "aenergy":{"total":0.000,"by_minute":[0.000,0.000,0.000],"minute_ts":1696186159},"temperature":{"tC":63.7, "tF":146.6}},"sys":{"mac":"A8032AB11964","restart_required":false,"time":"20:49","unixtime":1696186160,"uptime":9681,"ram_size":248472,"ram_free":126116,"fs_size":458752,"fs_free":94208,"cfg_rev":22,"kvs_rev":0,"schedule_rev":0,"webhook_rev":0,"available_updates":{"stable":{"version":"1.0.3"}}},"wifi":{"sta_ip":"172.20.10.3","status":"got ip","ssid":"Leo?s IPhone ","rssi":-58},"ws":{"connected":false}}}
           

          // Breakdown the message object and extract what is needed only.
          let payload_message = JSON.parse(message);
          // console.log("Payload: ", payload_message);
          let payload_src = payload_message["src"];
          let result = payload_message["result"];
          let payload_params = result["switch:0"];
          // console.log("Params",payload_params);
          let switch_status = payload_params["output"];
          let power = payload_params["apower"]  0.001; //This converts currently measure power to Kw
          let voltage = payload_params["voltage"];
          let current_ = payload_params["current"];
          let aenergy = payload_params["aenergy"]["total"];

          let payload = {
            applience_id: "",
            payload_src,
            switch_status,
            power,
            voltage,
            current: current_,
            aenergy,
            label:`${current_hour}:${current_minute}`
          };
          let res = payload
          console.log(res);
          //WebSocketServer.clients.forEach(function each(client) {
           // if (client === ws && client.readyState === WebSocket.OPEN) {
            // This is sending the same message 8 times
            WebSocketServer.emit("message", payload);
            //}
          //});
          // Compare previously stored hour with currenlty stored hour
          //   console.log("Devices array length: ",devices.length);

          // Check the switch status and the power and if switch is on and no device is plugged in, send an alert, we can store previous power and previous current, and just use them to check
          // if (stored_minute != current_minute) {
          //   console.log("Minute different");
          //   stored_minute = current_minute;
          //   if (payload_src == process.env.CLIENT1) {
          //     WebSocketServer.clients.forEach(function each(client) {
          //       if (client === ws && client.readyState === WebSocket.OPEN) {
          //         client.emit("message", payload);
          //       }
          //     });
          //   }
          //   if (payload_src == process.env.CLIENT2) {
          //     WebSocketServer.clients.forEach(function each(client) {
          //       if (client === ws && client.readyState === WebSocket.OPEN) {
          //         client.emit("message", payload);
          //       }
          //     });
          //   }
          // }
        });
      });
    });

    //Add the websocket server as a subscriver to the topics of both devices
    MQTTClient.subscribe(process.env.SUBSCRIBERTOPIC1.toString());
    MQTTClient.subscribe(process.env.SUBSCRIBERTOPIC2.toString());
    // MQTTClient.subscribe("test");
    // MQTTClient.subscribe("test2");

    ws.onclose = (event) => {
      console.log("Client closed connection to socket");
    };
  };

  WebSocketServer.on("connection", onConnection);

  WebSocketServer.on("close", (ws) => {
    console.log("client disconnected");
    // clients.delete(ws)
  });
};

module.exports = CreateWebSocketServer;
