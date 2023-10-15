const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileImageSchema = new Schema({
  //Image string
  image: String,
  // User ID
  userId: String
});

const Images = mongoose.model("ProfileImage", ProfileImageSchema);

module.exports = Images;

