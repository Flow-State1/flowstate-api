const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db =
  "mongodb+srv://dswfullstack:FullstackDSW2023@flowstate.1gxjqhm.mongodb.net/flowstate?retryWrites=true&w=majority";
const app = express();
const port = 3001;
app.use(bodyParser.json());
var cors = require("cors");
const publish = require("./router/publisherRouter");
const subscribe = require("./router/subscriberRouter");

//Connecting to the db
mongoose
  .connect(db)
  .then((res) => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });

app.use([cors()]);
app.use("/publish", publish);
app.use("/subscribe", subscribe);
