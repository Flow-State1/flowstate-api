const Consumptions = require("../models/consumption");
require("dotenv").config();

// This gets all the results stored in the switch object, it returns an array with smaller arrays of a max size of 60 storing the necessary data
const getAllConsumptions = (req, res) => {
  Consumptions.find()
    .then((consumptions) => {
    //     // console.log(consumptions.length);
    //   let ChunkArray = [];
    //   for (let i = 0; i < consumptions.length; i += 60) {
    //     const chunk = consumptions.slice(i, i + 60);
    //     const payloadChunk = chunk.map(item => {
    //         const{current,voltage} = JSON.parse(item.payload)["result"]["switch:0"]
    //         return({current,voltage})
    //     }    
    //     );
    //     ChunkArray.push(payloadChunk);
    //   }
    // //   console.log(ChunkArray[1].length);
      res.send(JSON.stringify(ChunkArray));
    })
    .catch((error) => {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    });
};
const getAllConsumptions1 = (req, res) => {
  Consumptions.find({topic:process.env.SUBSCRIBERTOPIC1})
    .then((consumptions) => {
        // console.log(consumptions.length);
      let ChunkArray = [];
      for (let i = 0; i < consumptions.length; i += 60) {
        const chunk = consumptions.slice(i, i + 60);
        const payloadChunk = chunk.map(item => {
            const{current,voltage} = JSON.parse(item.payload)["result"]["switch:0"]
            return({current,voltage})
        }    
        );
        ChunkArray.push(payloadChunk);
      }
    //   console.log(ChunkArray[1].length);
      res.send(JSON.stringify(ChunkArray));
    })
    .catch((error) => {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    });
};
// This gets all the results stored in the switch object, it returns an array with smaller arrays of a max size of 60 storing the necessary data
const getAllConsumptions2 = (req, res) => {
  Consumptions.find({topic:process.env.SUBSCRIBERTOPIC2})
    .then((consumptions) => {
        // console.log(consumptions.length);
      let ChunkArray = [];
      for (let i = 0; i < consumptions.length; i += 60) {
        const chunk = consumptions.slice(i, i + 60);
        const payloadChunk = chunk.map(item => {
            const{current,voltage} = JSON.parse(item.payload)["result"]["switch:0"]
            return({current,voltage})
        }    
        );
        ChunkArray.push(payloadChunk);
      }
    //   console.log(ChunkArray[1].length);
      res.send(JSON.stringify(ChunkArray));
    })
    .catch((error) => {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    });
};

// Get Consumption by the shelly-ID/Topic
const getConsumption1 = (req, res) => {
  // const {date} = req.params;
  Consumptions.find({ topic: process.env.SUBSCRIBERTOPIC1 })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(404).json({
        id: "Error Retrieving by date",
        states: "Not Found",
        message: error,
      });
    });
};
const getConsumption2 = (req, res) => {
  // const {date} = req.params;
  Consumptions.find({ topic: process.env.SUBSCRIBERTOPIC2 })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(404).json({
        id: "Error Retrieving by date",
        states: "Not Found",
        message: error,
      });
    });
};

// This will retrieve data from the database based on that the createdAt field contains the date specified
const getConsumptiondate = (req, res) => {
  const { date } = req.params;
  console.log("Date:", date);
  Consumptions.find({
    $where: function () {
      return this.createdAt;
    },
  })
    .then((response) => {
      console.log(`Response:${response}`);
      res.status(200).json(response);
    })
    .catch((error) => {
      res.send(error);
    });
};

module.exports = {
  getAllConsumptions,
  getAllConsumptions1,
  getAllConsumptions2,
  getConsumption1,
  getConsumption2,
  getConsumptiondate,
};
