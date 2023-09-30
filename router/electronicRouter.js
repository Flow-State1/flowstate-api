const Electronics = require("../models/Electronics");
const router = require("express").Router();

router.post("/", (request, response) => {
  const {
    electronic_category,
    electronic_brand,
    electronic_variant,
    electronic_rating,
    electronic_consumption,
    electronic_cost,
  } = request.body;

  const Electronic = new Electronics({
    electronic_caregory:electronic_category,
    electronic_brand:electronic_brand,
    electronic_variant:electronic_variant,
    electronic_rating:electronic_rating,
    electronic_consumption:electronic_consumption,
    electronic_cost:electronic_cost,
  });

  console.log(
    electronic_category,
    electronic_brand,
    electronic_variant,
    electronic_rating,
    electronic_consumption,
    electronic_cost
  );

  Electronic.save()
    .then((result) => {
      // console.log(result);
      response.status(200).send(result);
    })
    .catch((err) => {
      response.send(err);
    });
});
router.get('/',(request,response)=>{
  Electronics.find().then((results)=>{
    response.status(200).send(results);
  }).catch((err)=>{
    console.log(err);
  })
})
router.get('/:category',(request,response)=>{
  const {category} = request.params;
  Electronics.find({
    electronic_caregory:category
  }).then((res)=>{
    // console.log(res);
    response.status(200).send(res);
  }).catch((err)=>{
    console.log(err);
  })
})

module.exports = router;
