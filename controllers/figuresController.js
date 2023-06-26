const Figures = require("../models/powerFigures")


//Get all records from DB
const get_records = (req, res) => {
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
}


//Adds a record to DB
const add_record = (req, res) => {
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
}


//Get Record by date
const get_records_by_date = (req, res) => {
  Figures.find({
    date: req.params.date
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
}

//Get Record by date range
const get_records_by_dateRange = (req, res) => {
  Figures.find({
    date: { $gte: req.params.date, $lte: req.params.date2 }
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
}

module.exports = {
    get_records,
    get_records_by_date,
    add_record,
    get_records_by_dateRange
}