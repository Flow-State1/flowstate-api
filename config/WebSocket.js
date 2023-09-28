const WebSocket = require("ws");
const MQTTClient = require("./MQTTConnection");
require("dotenv").config();
const Payloads = require("../models/Payload");
const fs = require("fs");
let user_id = "";

const CreateWebSocketServer = async (server, port) => {
  const WebSocketServer = new WebSocket.Server({ server });

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
          console.log("User with id: ", user_id);

          callback(null); // Indicate success
        });
      } else {
        console.log("File not present, meaning no user, logged in");
      }
    }
    console.log("User with id: ", user_id);
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

          // Breakdown the message object and extract what is needed only.
          let payload_message = JSON.parse(message);
          let payload_src = payload_message["src"];
          let payload_params = payload_message["params"];
          let switch_status = payload_params["output"];
          let power = payload_params["apower"] * 0.001; //This converts currently measure power to Kw
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
          };

          // Compare previously stored hour with currenlty stored hour
          //   console.log("Devices array length: ",devices.length);

          if (stored_hour != current_hour) {
            // Create a new payload and register devices to database

            if (payload_src == process.env.CLIENTID1) {
              try {
                const Payload = new Payloads({
                  user_id,
                  id: payload_src,
                  applience_id: shelly1.applience_id,
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
                // Check if paylaod to be created already exist
                let results = await Payloads.find({
                  user_id,
                  id: payload_src,
                  applience_id: shelly1.applience_id,
                  hour: `${current.getHours()}:00`,
                });
                if (results.length >= 2) {
                  console.log("Payloads exist");
                } else if (results.length == 0) {
                  Payload.save()
                    .then((saved) => {
                      console.log("Payload created");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              } catch (err) {
                console.log(err);
              }
            } else if (payload_src == process.env.CLIENTID2) {
              const Payload = new Payloads({
                user_id,
                id: payload_src,
                applience_id: shelly2.applience_id,
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
              //   Check if there is payload with defined info for creating new one
              let results = await Payloads.find({
                user_id,
                id: payload_src,
                applience_id: shelly2.applience_id,
                hour: `${current.getHours()}:00`,
              });
              if (results.length >= 2) {
                console.log("Payloads exist");
              } else if (results.length == 0) {
                Payload.save()
                  .then((saved) => {
                    stored_hour = current_hour;
                    console.log("Payload created and hour changed");
                  })
                  .catch((err) => {
                    response.send(err);
                  });
              }
            }
          } else {
            if (stored_minute != current_minute) {
              // console.log("Stored Minute: ",stored_minute);
              // console.log("Current minute: ",current_minute,"\n");
              stored_minute = current_minute;
              topic1 = 0;
              topic2 = 0;
            } else {
              // console.log("Stored Minute: ",stored_minute);
              // console.log("Current minute: ",current_minute,"\n");
              if (payload_src == process.env.CLIENTID1 && topic1 == 0) {
                // Update appropriate Payload
                payload.applience_id = shelly1.applience_id;
                topic1 = 1;
                console.log(
                  "Payload 1 at ",
                  `${current_hour}:${current_minute}`,
                  "",
                  payload
                );
                try {
                  let hour =
                    current.getHours() < 10
                      ? `0${current.getHours()}`
                      : current.getHours() + ":00";
                  const result = await Payloads.findOne({
                    id: payload_src,
                    user_id: user_id,
                    applience_id: payload.applience_id,
                    hour: hour,
                  });
                  console.log(
                    "Results for user:",
                    user_id,
                    " \n",
                    payload_src,
                    " and ",
                    payload.applience_id,
                    "at",
                    hour,
                    " ",
                    result,
                    " \n"
                  );

                  let labels = result.labels_array;
                  console.log("Array from DB before update: ", labels);
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
                  console.log("Array to be sent to db: ", labels);
                  let data = {
                    apower: power,
                    voltage,
                    current: current_,
                    aenergy,
                  };
                  dataArray.push(data);
                  // console.log(labels);

                  await Payloads.updateOne(
                    {
                      id: payload_src,
                      user_id: user_id,
                      applience_id: payload.applience_id,
                      hour: hour,
                    },
                    {
                      labels_array: labels,
                      data: dataArray,
                    }
                  );
                  const UpdatedPayload = await Payloads.findOne({
                    id: payload_src,
                    user_id: user_id,
                    applience_id: payload.applience_id,
                    hour: hour,
                  });

                  WebSocketServer.clients.forEach(function each(client) {
                    if (client === ws && client.readyState === WebSocket.OPEN) {
                      // console.log(
                      //   "Uprocessed Updated Data: ",
                      //   UpdatedPayload["data"]
                      // );

                      let json = {
                        payload_src,
                        labels_array: UpdatedPayload["labels_array"],
                        data: UpdatedPayload["data"],
                      };
                      const resultPayload = JSON.stringify(json);
                      // console.log("Updated Data: ", resultPayload);
                      try {
                        //Parse the incoming messages to json format
                        //   parsedMessage = JSON.stringify(UpdatedPayload);
                        console.log("Sending data for: ", payload_src);
                        client.send(resultPayload);
                        //let src = parsedMessage.src;
                      } catch (error) {
                        console.error("Error parsing MQTT message:", error);
                        return;
                      }
                    } else {
                      console.log("Clients websockets not open");
                    }
                  });
                  // console.log("Data updated");
                } catch (err) {
                  console.log(err);
                }
              } else if (payload_src == process.env.CLIENTID2 && topic2 == 0) {
                // Update appropriate payload
                payload.applience_id = shelly2.applience_id;
                topic2 = 1;
                console.log(
                  "Payload 2  at ",
                  `${current_hour}:${current_minute}`,
                  "",
                  payload
                );
                try {
                  let hour =
                    current.getHours() < 10
                      ? `0${current.getHours()}`
                      : current.getHours() + ":00";
                  const result = await Payloads.findOne({
                    id: payload_src,
                    user_id: user_id,
                    applience_id: payload.applience_id,
                    hour: hour,
                  });
                  console.log(
                    "Results for user:",
                    user_id,
                    " \n",
                    payload_src,
                    " and ",
                    payload.applience_id,
                    "at",
                    hour,
                    " ",
                    result,
                    " \n"
                  );

                  let labels = result.labels_array;
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
                    apower: power,
                    voltage,
                    current: current_,
                    aenergy,
                  };
                  dataArray.push(data);
                  // console.log(labels);

                  await Payloads.updateOne(
                    {
                      id: payload_src,
                      user_id: user_id,
                      applience_id: payload.applience_id,
                      hour: hour,
                    },
                    {
                      labels_array: labels,
                      data: dataArray,
                    }
                  );
                  const UpdatedPayload = await Payloads.findOne({
                    id: payload_src,
                    user_id: user_id,
                    applience_id: payload.applience_id,
                    hour: hour,
                  });
                  // console.log("Updated Data: ",resultPayload[]);
                  WebSocketServer.clients.forEach(function each(client) {
                    if (client === ws && client.readyState === WebSocket.OPEN) {
                      // console.log(
                      //   "Uprocessed Updated Data: ",
                      //   UpdatedPayload
                      // );

                      let json = {
                        payload_src,
                        labels_array: UpdatedPayload["labels_array"],
                        data: UpdatedPayload["data"],
                      };
                      const resultPayload = JSON.stringify(json);
                      // console.log("Updated Data: ", resultPayload);
                      try {
                        //Parse the incoming messages to json format
                        //   parsedMessage = JSON.stringify(UpdatedPayload);
                        console.log("Sending data for: ", payload_src);
                        client.send(resultPayload);
                        //let src = parsedMessage.src;
                      } catch (error) {
                        console.error("Error parsing MQTT message:", error);
                        return;
                      }
                    } else {
                      console.log("Clients websockets not open");
                    }
                  });
                  // console.log("Data updated");
                } catch (err) {
                  console.log(err);
                }
              }
            }
          }
        });
      });
    });

    //Add the websocket server as a subscriver to the topics of both devices
    MQTTClient.subscribe(process.env.SWITCH_SUBSCRIBERTOPIC1.toString());
    MQTTClient.subscribe(process.env.SWITCH_SUBSCRIBERTOPIC2.toString());
    MQTTClient.subscribe("test");
    MQTTClient.subscribe("test2");

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
