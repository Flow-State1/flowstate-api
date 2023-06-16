const Consumption = require('../models/consumption');
const publisher = require('../config/connection');

//This function publishes a message to via the MQTT broker to the mongodb database
const publish_message_post = (request,response)=>{
    
    const {topic,message} = request.body;

    publisher.publish(topic,message);

    const consumption = new Consumption({
        topic:topic,
        message:message
    })

    consumption.save()
    .then((result)=>{
        response.sendStatus(200)
    })   
}


module.exports = {
    publish_message_post
}