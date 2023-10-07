const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const device = require("./Devices");

const applienceSchema = new Schema({
    applience_id:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
        required:true
    },
    applience_brand:{
        type:String,
        required:true
    },
    applience_variant:{
        type:String,
        required:true
    },
    device_id:{
        type:String,
        required:false
    }
});

const Appliences = mongoose.model("Appliences", applienceSchema);

module.exports = Appliences;