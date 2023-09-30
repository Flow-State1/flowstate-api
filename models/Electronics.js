const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const electronicSchema = new Schema({
    electronic_caregory:{
        type:String,
        required:true,
    },
    electronic_brand:{
        type:String,
        required:true
    },
    electronic_variant:{
        type:String,
        required:true
    },
    electronic_rating:{
        type:String,
        required:true
    },
    electronic_consumption:{
        type:Number,
        required:true
    },
    electronic_cost:{
        type:Number,
        required:true
    }
});

const Electronics = mongoose.model("Electronics", electronicSchema);

module.exports = Electronics;