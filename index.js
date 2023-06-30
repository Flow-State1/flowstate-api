const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const db = process.env.DB;
const app = express();
const port = process.env.PORT || 3002;
app.use(bodyParser.json());
var cors = require("cors");
const publish = require("./router/publisherRouter");
const subscribe = require("./router/subscriberRouter");
const figures = require("./router/figuresRouter");
//Create an http server with the express app
const http = require("http");
const server = http.createServer(app);
const WebSocketServer = require("./config/WebSocket");

//Connecting to the db
mongoose
  .connect(db)
  .then((res) => {
    server.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });

//This creates an instance of the WebSocket server and listens to the same port as http server, this will be used for realtime data
//To get real time data the client should connect to the websocket then it will get a response sent to it whenever the websocket server receives a message
//For now to use the websocket it needs a client to send a message to it then the websocket will display the messages from the Shelly device
WebSocketServer(server, port);

//Routes
app.use([cors()]);
app.use("/publish", publish);
app.use("/subscribe", subscribe);
app.use("/figures", figures);
