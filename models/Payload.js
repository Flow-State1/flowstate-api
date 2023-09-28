const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payloadSchema = new Schema({
  //Device Id
  id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
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
  labels_array: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const Payloads = mongoose.model("Payload", payloadSchema);

module.exports = Payloads;
