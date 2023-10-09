const router = require("express").Router();
const appliencesController = require("../controllers/appliencesController");
const authController = require("../controllers/authController");
const Appliences = require("../models/Appliences");

router.post("/", async (request, response) => {
  const { device1Object, device2Object } = request.body;
  const date = new Date();
  // console.log("Device1 object:",device1Object);
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

  // Firstly find the appliences that have a similar shelly ID and set that shelly id to null then proceed to adding the new documents
  let shelly1 = device1Object.device_id;
  let shelly2 = device2Object.device_id;

  // applience_id: { $in: applience_id }
  await Appliences.updateMany(
    { device_id: { $in: [shelly1, shelly2] } },
    { device_id: null }
  )
    .then((result) => {
      // console.log("Result for updating: ", "\n", result);
    })
    .catch((err) => {
      console.log(err);
    });

  // Find the applience get the applience objects then delete them
  const result = await Appliences.find({
    applience_brand: {
      $in: [device1Object.applience_brand, device2Object.applience_brand],
    },
    applience_variant: {
      $in: [device1Object.applience_variant, device2Object.applience_variant],
    },
    user_id: device1Object.user_id,
  });
  console.log(result);
  // Recreate the applience document using the applience objects that was gotten
  // Check results array if its 2 update the device_id
  if (result.length === 2) {
    const result1 = await Appliences.updateOne(
      {
        applience_id: result[0].applience_id,
      },
      {
        device_id: shelly1,
      }
    );
    const result2 = await Appliences.updateOne(
      {
        applience_id: result[1].applience_id,
      },
      {
        device_id: shelly2,
      }
    );
    // console.log(result1);
    // console.log(result2);
    if (result1.acknowledged && result2.acknowledged) {
      return response.json({
        applience_id1: result1.applience_id,
        applience_id2: result2.applience_id,
      });
    } else {
      console.log("Server error");
      return response.sendStatus(500);
    }
  }

  if (result.length === 0) {
    let applienceIdObject;
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
        applienceIdObject = {
          applience_id1: results[0].applience_id,
          applience_id2: results[1].applience_id,
        };
      })
      .catch((err) => {
        console.log(err);
      });

    response.json(applienceIdObject);
  }

  if (result.length === 1) {
    if (device1Object.applience_variant === result[0].applience_variant) {
      await Appliences.updateOne(
        {
          applience_brand: result[0].applience_brand,
          applience_variant: result[0].applience_variant,
          user_id: result[0].user_id,
        },
        {
          device_id: shelly1,
        }
      ).then((res) => console.log("Id:1 Update one: ", res));
    } else {
      const applience = new Appliences({
        applience_brand: device1Object.applience_brand,
        applience_variant: device1Object.applience_variant,
        applience_id: applience_id1,
        user_id: result[0].user_id,
        device_id: device1Object.device_id,
      });
      await applience.save();
    }
    if (device2Object.applience_variant === result[0].applience_variant) {
      await Appliences.updateOne(
        {
          applience_brand: result[0].applience_brand,
          applience_variant: result[0].applience_variant,
          user_id: result[0].user_id,
        },
        {
          device_id: shelly2,
        }
      ).then((res) => console.log("Id:2 Update one: ", res));
    } else {
      const applience = new Appliences({
        applience_brand: device2Object.applience_brand,
        applience_variant: device2Object.applience_variant,
        applience_id: applience_id2,
        user_id: result[0].user_id,
        device_id: device2Object.device_id,
      });
      await applience.save();
    }

    return response.json({
      applience_id1: applience_id1,
      applience_id2: applience_id2,
    });
  }

  return;

  // Appliences.insertMany([
  //   {
  //     applience_id: applience_id1,
  //     applience_brand: device1Object.applience_brand,
  //     applience_variant: device1Object.applience_variant,
  //     user_id: device1Object.user_id,
  //     device_id: device1Object.device_id,
  //   },
  //   {
  //     applience_id: applience_id2,
  //     applience_brand: device2Object.applience_brand,
  //     applience_variant: device2Object.applience_variant,
  //     user_id: device2Object.user_id,
  //     device_id: device2Object.device_id,
  //   },
  // ])
  //   .then((results) => {
  //     let applienceIdObject = {
  //       applience_id1: results[0].applience_id,
  //       applience_id2: results[1].applience_id,
  //     };
  //     response.send(applienceIdObject);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

router.get("/:id", (request, response) => {
  const { id } = request.params;
  try {
    Appliences.find({
      user_id: id,
    }).then((results) => {
      // console.log("Appliences from user witth id: ",id,"\n",results);
      response.send(results);
    });
  } catch (err) {
    console.log(err);
    response.send(err);
  }
});

module.exports = router;
//
