const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    device_id:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
});

const Devices = mongoose.model("Devices", deviceSchema);

module.exports = Devices;