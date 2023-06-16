const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db =
  "mongodb+srv://dswfullstack:FullstackDSW2023@flowstate.1gxjqhm.mongodb.net/flowstate?retryWrites=true&w=majority";
const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.json());
var cors = require("cors");
const publish = require("./router/publisherRouter");
const subscribe = require("./router/subscriberRouter");
const Figures = require("./models/powerFigures")

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

//Adding recorded unit to database
app.post('/api/record', (req, res, next) => {
  const figure = new Figures({
    kwh: req.body.kwh,
    date: req.body.date
  });
  figure.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

//Fetching everything in the database
app.get('/api/everything', (req, res, next) => {
  Figures.find().then(
    (figures) => {
      res.status(200).json(figures);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

//Finding a record by specific date
app.get('/api/record/:date', (req, res, next) => {
  Figures.find({
    _date: req.params.date
  }).then(
    (figure) => {
      res.status(200).json(figure);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});
