const Consumption = require('../models/consumption');

const subscriber_get_all = (request, response) => {

    Consumption.find()
    .then((results)=>{
      response.send(results);
    }).catch((err)=>{
      console.log(err);
    })
  
}

module.exports ={
    subscriber_get_all
}