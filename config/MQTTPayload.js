const Payloads = require("../models/Payload");
const MQTTClient = require("./MQTTConnection");
const Appliences = require("../models/Appliences");

const createServer = () => {
  MQTTClient.on("message", async (_, message) => {
    const data = await JSON.parse(message);

    // console.log("Data received",data);
    // This is returning the first applience it finds with that specific device_id(Basically can only work if there are only 2 devices registered)
    const result = await Appliences.findOne({ device_id: data["src"] });
    console.log("Results for applience with id: ",data["src"],"\n",result );
    const date = new Date();
    const hour =
      date.getHours() < 10 ? `0${date.getHours()}:00` : `${date.getHours()}:00`;
    const minute =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    if (result) {
      const newData = new Payloads({
        applience_id: result["applience_id"],
        date: `${Date.now()}`,
        hour,
        label: `${hour.substring(0, 2)}:${minute}`,
        data: JSON.stringify(data.result["switch:0"]),
      });

      newData.save().then((response) => {
        console.log("Response for applience_id: ",result["applience_id"]," ", response);
      });
    }
  });
  MQTTClient.subscribe(process.env.SUBSCRIBERTOPIC1.toString());
  MQTTClient.subscribe(process.env.SUBSCRIBERTOPIC2.toString());
  MQTTClient.subscribe("test");
  MQTTClient.subscribe("test2");
};

module.exports = createServer;
