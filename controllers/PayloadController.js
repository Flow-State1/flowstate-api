const Payloads = require("../models/Payload");
const Appliences = require("../models/Appliences");
const fs = require("fs");

let first_time_running = true;
// Post Functions
const createHourGroup = (request, response) => {
  let labelArray = [];
  const date = new Date();

  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hour = `${date.getHours()}:00`;
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const time = `${date.getHours()}:${minutes}`;
  labelArray.push(`${date.getHours()}:${minutes}`);

  const { id, data, applience_brand, applience_variant, device } = request.body;
  const applience_id = `${applience_variant}_${date.getHours()}:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }_${year}${month}-${day}`;

  const deviceObject = {
    device,
    id,
    applience_id,
    applience_brand,
    applience_variant,
  };

  const dataObject = JSON.stringify(deviceObject);
  console.log("First time running: ", first_time_running);
  // Must check if its the first time this is running and if it is you want to overwrite the file, else you want to append to the file
  if (!first_time_running) {
    fs.appendFile("./data/devices.txt", dataObject + "\n", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      }
    });
  } else if (first_time_running) {
    first_time_running = false
    fs.writeFile("./data/devices.txt", dataObject + "\n", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      }
    });
  }

  const Applience = new Appliences({
    applience_id,
    applience_brand,
    applience_variant,
  });
  Applience.save()
    .then((saved) => {
      const Payload = new Payloads({
        id,
        applience_id,
        date: `${year}-${month}-${day}`,
        hour: `${date.getHours()}:00`,
        labels_array: labelArray,
        data,
      });

      Payload.save()
        .then((saved) => {
          console.log("Saved");
          response.status(200).send(saved);
        })
        .catch((err) => {
          response.send(err);
        });
    })
    .catch((err) => {
      response.send(err);
    });
};

// Put Functions
const updateHourGroup = (request, response) => {
  let labelArray = [];
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hour = `${date.getHours()}:00`;
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const time = `${date.getHours()}:${minutes}`;
  labelArray.push(time);
  const { data, applience_id } = request.body;
  //To save in an existing collection
  Payloads.findOne({
    applience_id,
  }).then((result) => {
    let labels = result.labels_array;
    console.log(labels);
    let dataArray = result.data;
    labels.push(`${date.getHours()}:${minutes}`);
    dataArray.push(data);
    console.log(labels);
    Payloads.updateOne(
      {
        applience_id,
      },
      {
        labels_array: labels,
        data: dataArray,
      }
    )
      .then((res) => response.sendStatus(200))
      .catch((err) => response.send(err));
  });
};

// Router to change value of first time running
const firstTimeRunning = (req,res)=>{
  console.log("First time running before call:",first_time_running);
  first_time_running = !first_time_running ;
  console.log("First time running after call:",first_time_running,"\n");
  fs.unlink("./data/devices.txt", (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    } else {
      console.log('File deleted successfully');
      res.sendStatus(200)
    }
  });
  
}

// Get Fuctions
const getGroupbyDateHour = (request, response) => {
  const { id, date, hour } = request.body;
  Payloads.findOne({
    id,
    date,
    hour,
  })
    .then((results) => {
      response.send(results);
    })
    .catch((errors) => {
      response.send(
        `Id:Error Fetching payload by date and hour group,message:${errors}`
      );
    });
};

const getOne = (request, response) => {
  const { id, data, applience_id } = request.body;

  //To save in an existing collection
  Payloads.findOne({
    applience_id,
  })
    .then((result) => {
      console.log(result);
      response.send(result);
    })
    .catch((errors) => {
      response.send(errors);
    });
};

const getAll = (request, response) => {
  Payloads.find()
    .then((results) => {
      response.send(results);
    })
    .catch((errors) => {
      response.send(`Id:Error Fetching all documents,message:${errors}`);
    });
};

const getSpecific = (req,res)=>{
  const {id,applience_id} = req.body;
  Payloads.findOne({
    id,applience_id
  }).then((result)=>{
    res.send(result);
  }).catch((err)=>{
    res.send(err);
  })
}

module.exports = {
  createHourGroup,
  updateHourGroup,
  getGroupbyDateHour,
  getAll,
  getOne,
  firstTimeRunning,getSpecific
};
