const express = require("express");
const userRouter = express.Router();
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const multer = require('multer');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profile-pictures');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `profile-${req.user.id}-${Date.now()}${extname}`);
  },
});

const upload = multer({ storage });

const uploadImage = (async (req, res, next) => {
  try {
    // Save the filename or path in the user's 'photo' field in the database
    req.user.photo = req.file.filename;
    await req.user.save({validateBeforeSave: false});

    const pictureURL = `/uploads/profile-pictures/${req.file.filename}`;

    return next(res.status(200).json({
      imageURL: pictureURL,
      message: 'Profile picture uploaded successfully'
    }));
    
  } catch (error) {
    console.error(error);
    return next(res.status(500).json({
      error: 'Internal server error' 
    }));
  }
});

//Endpoint relevant for sign up authentication
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);

//Endpoint relevant for password resetting operations
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

//Endpoint relevant for updating authenticated users, hense the route is protected
userRouter.patch('/updateMyPassword', authController.protect, authController.updatePassword);
userRouter.post('/updateMe', authController.protect, userController.updateMe);

//Endpoint for image upload
userRouter.post('/upload-profile-picture', authController.protect, upload.single('profilePicture'), uploadImage);

//Endpoint relevant for deleting authenticated users, hense the route is protected
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);

//Endpoint retrieves all users from the DB and creates a user
userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

//Enpoint retrieves, updates, and deletes a specific user based on their id
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = userRouter;