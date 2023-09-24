const router = require("express").Router();
const Appliences = require("../models/Appliences");
const Payloads = require("../models/Payload");

// router.post("/", (request, response) => {


//   let labelArray = [];
//   const date = new Date();
//   const year = date.getFullYear();
//   const month =
//     date.getMonth() + 1 < 10
//       ? `0${date.getMonth() + 1}`
//       : date.getMonth() + 1;
//   const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
//   const hour = `${date.getHours()}:00`;
//   const minutes =
//     date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
//   const time = `${date.getHours()}:${minutes}`;
//   labelArray.push(time);

//   const { device_id, applience_brand, applience_variant,data } = request.body;
//   const applience_id = `${applience_variant}_${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}_${year}${month}-${day}`;

//   const Applience = new Appliences({
//     applience_id,
//     applience_brand,
//     applience_variant,
//   });
//   Applience.save()
//     .then((saved) => {

//       const Payload = new Payloads({
//         id,
//         applience_id,
//         date: `${year}-${month}-${day}`,
//         hour: `${date.getHours()}:00`,
//         labels_array: labelArray,
//         data,
//       });

//       Payload.save()
//         .then((saved) => {
//           response.sendStatus(200);
//         })
//         .catch((err) => {
//           response.send(err);
//         });
//     })
//     .catch((err) => {
//       response.send(err);
//     });
// });

router.get('/',()=>{
  
})

module.exports = router;
