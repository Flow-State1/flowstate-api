const mongoose = require("mongoose");

//This can be thought of the constructor
const Schema = mongoose.Schema;

//This is where we define the schema and the properties as well as its types
const consumptionSchema = new Schema({
    topic:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true,
    }
},{timestamps:true});


//This creates a model first argument is the name of the model. It pluralizes the name. The second argument is the Schema we want to base the model out of
const Consumptions = mongoose.model('Consumption',consumptionSchema)


module.exports = Consumptions;