const router = require("express").Router();
const Payloads = require("../models/Payload");
const PayloadController = require("../controllers/PayloadController");

// Save a new data for new hour group
router.post("/", PayloadController.createHourGroup);
router.post("/2", PayloadController.createPayloadOnly);
router.get("/reset", PayloadController.firstTimeRunning);
// router.post('/test',PayloadController.getSpecific)

// Edit data for an existing hour group
router.put("/", PayloadController.updateHourGroup);

// To reset devices in file

//Get the consumption by date and hour group
router.get("/", PayloadController.getGroupbyDateHour);
router.get("/1", PayloadController.getOne);

router.post("/dashboard", (request, response) => {
  // Filter by applience Id(get all the appliences with that specified ID);

  try {
    const { applience_id } = request.body;
    console.log("App ID",applience_id);
    Payloads.find({
      applience_id: { $in: applience_id },
      
    }).then((res) => {
      // console.log(res);
      let data = [];
      res.forEach((element) => {
        // Convert date

        let date = new Date(parseInt(element.date)).toLocaleString();
        // console.log(date);
        let dataObject = JSON.parse(element.data);

        data.push({
          applience_id: element.applience_id,
          hour: element.hour,
          label: element.label,
          date: date,
          data: dataObject,
          id: element._id.toString(),
        });
      });
      // console.log(data);
      let object = {};
      // Filter the array according to the applience_id

      

      applience_id.forEach((applience) => {
        let filtered = data.filter((item) => item.applience_id == applience);
        object[applience] = filtered;
      });

      response.send(object);
    });
  } catch (err) {
    response(err);
  }
});

router.get("/all", PayloadController.getAll);
router.get("/thirty", PayloadController.getThirtyDays);
router.get("/seven", PayloadController.getSevenDays);
router.get("/yesterday", PayloadController.getYesterday);
router.get("/today", PayloadController.getToday);

module.exports = router;
