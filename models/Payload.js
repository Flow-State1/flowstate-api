const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payloadSchema = new Schema({
  //Device Id
  applience_id: {
    type: String,
    required: true,
  },
  // Date Year-Month-Day
  date: {
    type: String,
    required: true,
  },
  hour: {
    type: String,
    required: true,
  },
  // Array of the hour and minutes when data was added to be used and matched with the data in the data array
  label: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

const Payloads = mongoose.model("Payload", payloadSchema);

module.exports = Payloads;

