const router = require("express").Router();
const Payloads = require("../models/Payload");
const PayloadController = require("../controllers/PayloadController");

// Save a new data for new hour group
router.post("/", PayloadController.createHourGroup);

// Edit data for an existing hour group
router.put("/", PayloadController.updateHourGroup);

//Get the consumption by date and hour group
router.get("/", PayloadController.getGroupbyDateHour);

module.exports = router;
