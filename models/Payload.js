
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Payload = mongoose.Schema;

const PayloadSchema = new Schema({
  // Date Year-Month-Day
  date: {
    type:String,
    required:true
  },
  hours:{
    type:Array,
    required:true
  },


});

const Payloads = mongoose.model('Payload',PayloadSchema)

module.exports = Payloads;
