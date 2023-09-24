const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applienceSchema = new Schema({
    applience_id:{
        type:String,
        required:true,
    },
    applience_brand:{
        type:String,
        required:true
    },
    applience_variant:{
        type:String,
        required:true
    }
});

const Appliences = mongoose.model("Applience",applienceSchema);

module.exports = Appliences;