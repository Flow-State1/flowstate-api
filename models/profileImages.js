const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileImageSchema = new Schema({
  //Image string
  image: {
    type: String,
    required: true,
  },
  // User ID
  userId: {
    type: String,
    required: true,
  }
});

const Images = mongoose.model("ProfileImage", ProfileImageSchema);

module.exports = Images;

