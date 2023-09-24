const WebSocket = require("ws");
const MQTTClient = require("./MQTTConnection");
require("dotenv").config();
const mqtt_message = JSON.stringify(process.env.MESSAGE1);
const Consumptions = require("../models/consumption");
const Payloads = require("../models/Payload");
const Appliences = require("../models/Appliences");
const { MqttClient } = require("mqtt");
const fs = require("fs");

const CreateWebSocketServer = (server, port) => {
  const WebSocketServer = new WebSocket.Server({ server });

  console.log("Web socket listening on ", port);
  let date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let stored_minute = "00";
  let first_time_running = true;
  stored_minute =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  let stored_hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  let stored_topic = "initial";
  let applienceid = "";
  let applienceid1 = "";
  let applienceid2 = "";
  let shelly1 = "";
  let shelly2 = "";
  let dataRetrieved = 0;

  //Check for connection to web socket

  WebSocketServer.on("connection", (ws) => {
    console.log("New Client Connected to Web Socket Server");

    //Send MQTT messages via websocket, whenever the api receives messages from the device

    MQTTClient.on("message", async (topic, message) => {
      console.log("Currently Received Topic:", topic);
      let current = new Date();
      let current_minute =
        current.getMinutes() < 10
          ? `0${current.getMinutes()}`
          : current.getMinutes();

      let current_hour =
        current.getHours() < 10 ? `0${current.getHours()}` : current.getHours();

      // Breakdown the message object and extract what is needed only.
      let payload_message = JSON.parse(message);
      let payload_src = payload_message["src"];
      let payload_params = payload_message["params"];
      let switch_status = payload_params["output"];
      let power = payload_params["apower"]*0.001;//This converts currently measure power to Kw/h
      let voltage = payload_params["voltage"];
      let current_ = payload_params["current"];
      let aenergy = payload_params["aenergy"]["total"];

      let payload = {
        payload_src,
        switch_status,
        power,
        voltage,
        current_,
        aenergy,
      };

      // Compare previously stored hour with currenlty stored hour
      if (stored_hour != current_hour) {
        console.log("Stored hour is different from current hour\n");

        //Check if there is a similar payload that laready exist before creating a new one and create a new one otherwise

        function readFileAndProcess(callback) {
          fs.readFile("./data/devices.txt", (err, data) => {
            if (err) {
              console.error("Error reading file:", err);
              callback(err);
              return;
            }

            let processed_data = data.toString().trim().split("\n");
            processed_data.forEach((element) => {
              let device_object = JSON.parse(element);
              let shelly_id = device_object.id;

              // Check the source of the stored appliance and compare it with the clientID
              if (shelly_id == process.env.CLIENTID1) {
                shelly1 = shelly_id;
                applienceid1 = device_object.applience_id;
                // console.log("device_object.applience_id:",device_object.applience_id);
              } else if (shelly_id == process.env.CLIENTID2) {
                shelly2 = shelly_id;
                applienceid2 = device_object.applience_id;
                // console.log("device_object.applience_id:",device_object.applience_id);
              }
            });

            callback(null); // Indicate success
          });
        }

        // Call the function and pass a callback
        readFileAndProcess(async (err) => {
          if (err) {
            console.error("Error processing file:", err);
            return;
          }
          if (payload_src == shelly1) {
            try {
              const Payload = new Payloads({
                id: payload_src,
                applience_id: applienceid1,
                date: `${year}-${month}-${day}`,
                hour: `${current.getHours()}:00`,
                labels_array: [],
                data: {
                  apower: power,
                  voltage: voltage,
                  current: current_,
                  aenergy: aenergy,
                },
              });
              let results = await Payloads.find({
                id: payload_src,
                applience_id: applienceid1,
                hour: `${current.getHours()}:00`,
              });

              if (results.length >= 2) {
                console.log("Payloads exist");
              } else if (results.length == 0) {
                console.log("Length at",payload_src,": ",results.length);
                Payload.save()
                  .then((saved) => {
                    console.log("Payload created");
                  })
                  .catch((err) => {
                    response.send(err);
                  });
              }
            } catch (err) {
              console.log(err);
            }
          } else if (payload_src == shelly2) {
            try {
              const Payload = new Payloads({
                id: payload_src,
                applience_id: applienceid2,
                date: `${year}-${month}-${day}`,
                hour: `${current.getHours()}:00`,
                labels_array: [],
                data: {
                  apower: power,
                  voltage: voltage,
                  current: current_,
                  aenergy: aenergy,
                },
              });
              let results = await Payloads.find({
                id: payload_src,
                applience_id: applienceid2,
                hour: `${current.getHours()}:00`,
              });
              // console.log("results at",payload_src,", ",applienceid2,", ",`${current.getHours()}:00`," ",results);
              if (results.length >= 2) {
                console.log("Payloads exist");
              } else if (results.length == 0) {
                console.log("Length at",payload_src,": ",results.length);
                Payload.save()
                  .then((saved) => {
                    stored_hour = current_hour;
                    console.log("Payload created and hour changed");
                  })
                  .catch((err) => {
                    response.send(err);
                  });
              }

            } catch (err) {
              console.log(err);
            }
          }
        });

        // Logic to create a new payload and store data received when this payload was created

        // Read from file and and get the applience_ID and append it to the payload
      } else if (stored_hour == current_hour) {
        console.log("Stored hour is similar to current hour\n");

        // Check if we are still in the same inute as the previously recorded one or not
        if (stored_minute != current_minute) {
          first_time_running = true;
          console.log("Stored minute is not similar to current minute\n");
          stored_minute =
            current.getMinutes() < 10
              ? `0${current.getMinutes()}`
              : current.getMinutes();
          dataRetrieved = 0;
        }

        //
        else if (stored_minute == current_minute) {
          console.log("Stored minute is similar to current minute");
          // If the current topic is not similar to the previous topic and if first time running is true, update data in the database and set first time running to false
          if (topic != stored_topic && dataRetrieved != 2) {
            console.log("Topic", stored_topic, "not recorded stored");

            function readFileAndProcess(callback) {
              fs.readFile("./data/devices.txt", (err, data) => {
                if (err) {
                  console.error("Error reading file:", err);
                  callback(err);
                  return;
                }

                let processed_data = data.toString().trim().split("\n");
                processed_data.forEach((element) => {
                  let device_object = JSON.parse(element);
                  let shelly_id = device_object.id;

                  // Check the source of the stored appliance and compare it with the clientID
                  if (shelly_id == process.env.CLIENTID1) {
                    shelly1 = shelly_id;
                    applienceid1 = device_object.applience_id;
                    // console.log("device_object.applience_id:",device_object.applience_id);
                  } else if (shelly_id == process.env.CLIENTID2) {
                    shelly2 = shelly_id;
                    applienceid2 = device_object.applience_id;
                    // console.log("device_object.applience_id:",device_object.applience_id);
                  }
                });

                callback(null); // Indicate success
              });
            }

            // Call the function and pass a callback
            readFileAndProcess(async (err) => {
              if (err) {
                console.error("Error processing file:", err);
                return;
              }
              if (payload_src == shelly1) {
                try {
                  let hour =
                    current.getHours() < 10
                      ? `0${current.getHours()}`
                      : current.getHours() + ":00";
                  const result = await Payloads.findOne({
                    id: payload_src,
                    applience_id: applienceid1,
                    hour: hour,
                  });
                  console.log(
                    "Results for:",
                    payload_src,
                    " and ",
                    applienceid1,
                    "at",
                    hour,
                    " ",
                    result
                  );

                  let labels = result.labels_array;
                  console.log(labels);
                  let dataArray = result.data;
                  labels.push(
                    `${
                      current.getHours() < 10
                        ? `0${current.getHours()}`
                        : current.getHours()
                    }:${
                      current.getMinutes() < 10
                        ? `0${current.getMinutes()}`
                        : current.getMinutes()
                    }`
                  );

                  let data = {
                    apower: 0,
                    voltage,
                    current,
                    aenergy,
                  };
                  dataArray.push(data);
                  console.log(labels);

                  await Payloads.updateOne(
                    { applience_id: applienceid },
                    {
                      labels_array: labels,
                      data: dataArray,
                    }
                  );
                  
                  first_time_running = false;
                  dataRetrieved++;
                  stored_topic = topic;
                  WebSocketServer.clients.forEach(function each(client) {
                    if (client === ws && client.readyState === WebSocket.OPEN) {
                        let parsedMessage;
                        try {
                            //Parse the incoming messages to json format
                            parsedMessage = JSON.stringify(payload);
                            client.send(parsedMessage);
                            //let src = parsedMessage.src;
                        } catch (error) {
                            console.error('Error parsing MQTT message:', error);
                            return;
                        }
                    }
                    else{
                        console.log("Clients websockets not open");
                    }
                });
                  console.log("Data updated");
                } catch (err) {
                  console.log(err);
                }
              } else if (payload_src == shelly2) {
                try {

                  let hour =
                    current.getHours() < 10
                      ? `0${current.getHours()}`
                      : current.getHours() + ":00";
                  const result = await Payloads.findOne({
                    id: payload_src,
                    applience_id: applienceid2,
                    hour: hour,
                  });
                  console.log(
                    "Results for:",
                    payload_src,
                    " and ",
                    applienceid2,
                    "at",
                    hour,
                    " ",
                    result
                  );

                  let labels = result.labels_array;
                  console.log(labels);
                  let dataArray = result.data;
                  labels.push(
                    `${
                      current.getHours() < 10
                        ? `0${current.getHours()}`
                        : current.getHours()
                    }:${
                      current.getMinutes() < 10
                        ? `0${current.getMinutes()}`
                        : current.getMinutes()
                    }`
                  );

                  let data = {
                    apower: 0,
                    voltage,
                    current,
                    aenergy,
                  };
                  dataArray.push(data);
                  console.log(labels);

                  await Payloads.updateOne(
                    { applience_id: applienceid },
                    {
                      labels_array: labels,
                      data: dataArray,
                    }
                  );
                  first_time_running = false;
                  dataRetrieved++;
                  stored_topic = topic;
                  
                  WebSocketServer.clients.forEach(function each(client) {
                    if (client === ws && client.readyState === WebSocket.OPEN) {
                        let parsedMessage;
                        try {
                            //Parse the incoming messages to json format
                            let payload = {
                              time_label:`${current.getHours() < 10? `0${current.getHours()}`: current.getHours()}:${current.getMinutes() < 10? `0${current.getMinutes()}`: current.getMinutes()
                              }`,
                              payload_src,
                              switch_status,
                              power,
                              voltage,
                              current_,
                              aenergy,
                            };
                            parsedMessage = JSON.stringify(payload);
                            client.send(parsedMessage);
                            //let src = parsedMessage.src;
                        } catch (error) {
                            console.error('Error parsing MQTT message:', error);
                            return;
                        }
                    }
                    else{
                        console.log("Clients websockets not open");
                    }
                });
                  console.log("Data updated");
                } catch (err) {
                  console.log(err);
                }
              }
            });
          } else if (topic == stored_topic) {
            console.log("Topic", topic, "is stored");
          }
        }
      }
    });

    //Add the websocket server as a subscriver to the topics of both devices
    MQTTClient.subscribe(process.env.SWITCH_SUBSCRIBERTOPIC1.toString());
    MQTTClient.subscribe(process.env.SWITCH_SUBSCRIBERTOPIC2.toString());
    MQTTClient.subscribe("test");
    MQTTClient.subscribe("test2");
  });

  WebSocketServer.on("close", (ws) => {
    console.log("client disconnected");
  });
};

module.exports = CreateWebSocketServer;
