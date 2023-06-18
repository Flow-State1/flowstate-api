const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config()
const db = process.env.DB;
const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.json());
var cors = require("cors");
const publish = require("./router/publisherRouter");
const subscribe = require("./router/subscriberRouter");
const figures = require("./router/figuresRouter");

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
app.use("/figures",figures);


