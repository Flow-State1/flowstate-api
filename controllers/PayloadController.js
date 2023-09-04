const Payloads = require("../models/Payload");

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
  labelArray.push(time);
  const { id, data } = request.body;
  const Payload = new Payloads({
    id,
    date: `${year}-${month}-${day}`,
    hour: `${date.getHours()}:00`,
    labels: labelArray,
    data,
  });

  Payload.save()
    .then((saved) => {
      response.sendStatus(200);
    })
    .catch((err) => {
      response.send(`Error:${err}`);
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
  const { id, data } = request.body;
  //To save in an existing collection
  Payloads.findOne({
    id,
    date: `${year}-${month}-${day}`,
    hour: `${date.getHours()}:00`,
  }).then((result) => {
    let labels = result.labels;
    let dataArray = result.data;
    labels.push(time);
    dataArray.push(data);
    Payloads.updateOne(
      {
        id,
        date: `${year}-${month}-${day}`,
        hour: `${date.getHours()}:00`,
      },
      {
        labels,
        data: dataArray,
      }
    )
      .then((res) => response.sendStatus(200))
      .catch((err) => response.send(err));
  });
};

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

module.exports = {
  createHourGroup,
  updateHourGroup,
  getGroupbyDateHour
};
