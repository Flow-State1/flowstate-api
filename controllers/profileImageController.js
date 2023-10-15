const ProfileImage = require('./../models/profileImages');

const uploadImage = async(req, res) => {
    const base64 = req.body.base64;
    try {
        ProfileImage.create({image:base64});

        res.send({Status: 'OK'});
    } catch (error) {
        res.send({Status: "error", data:error});
    }
};

module.exports = {
  uploadImage,

}