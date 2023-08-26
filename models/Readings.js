const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reading = mongoose.Schema;

const ReadingSchema = new Schema({
  time: {
    type: String,
    required: true,
  },
  apower: {
    type: String,
    required: true,
  },
  voltage: {
    type: String,
    required: true,
  },
  current: {
    type: String,
    required,
  },
  aenergy: {
    type: String,
    required: true,
  },
});

const Readings = mongoose.model("Payload", ReadingSchema);

module.exports = Readings;
