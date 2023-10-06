const router = require("express").Router();
const appliencesController = require("../controllers/appliencesController");
const authController = require("../controllers/authController");
const Appliences = require("../models/Appliences");


router.post("/", (request, response) => {
  const { device1Object, device2Object } = request.body;
  const date = new Date();
  const applience_id1 = `${
    device1Object.applience_variant
  }_${date.getHours()}:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }`;
  const applience_id2 = `${
    device2Object.applience_variant
  }_${date.getHours()}:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }`;

  Appliences.insertMany([
    {
      applience_id: applience_id1,
      applience_brand: device1Object.applience_brand,
      applience_variant: device1Object.applience_variant,
      user_id: device1Object.user_id,
      device_id: device1Object.device_id,
    },
    {
      applience_id: applience_id2,
      applience_brand: device2Object.applience_brand,
      applience_variant: device2Object.applience_variant,
      user_id: device2Object.user_id,
      device_id: device2Object.device_id,
    },
  ])
    .then((results) => {
      let applienceIdObject = {
        applience_id1: results[0].applience_id,
        applience_id2: results[1].applience_id,
      };
      response.send(applienceIdObject);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", (request,response)=>{
    const {id} = request.params;
    try{
        Appliences.find({
            user_id:id
        }).then((results)=>{
            // console.log("Appliences from user witth id: ",id,"\n",results);
            response.send(results)
        })
    }catch(err){
        console.log(err);
        response.send(err)
    }
});

module.exports = router;
//
