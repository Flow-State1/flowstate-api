const router = require("express").Router();
const Payloads = require("../models/Payload");
const PayloadController = require("../controllers/PayloadController");

// Save a new data for new hour group
router.post("/", PayloadController.createHourGroup);
router.get('/reset',PayloadController.firstTimeRunning);
router.post('/test',PayloadController.getSpecific)

// Edit data for an existing hour group
router.put("/", PayloadController.updateHourGroup);

// To reset devices in file


//Get the consumption by date and hour group
router.get("/", PayloadController.getGroupbyDateHour);
router.get("/1",PayloadController.getOne)

router.get("/all",PayloadController.getAll);

module.exports = router;
