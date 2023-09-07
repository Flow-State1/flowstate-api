const express = require("express");
const userRouter = express.Router();
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

//Endpoint relevant for sign up authentication
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
//userRouter.post('/logout', authController)

//Endpoint relevant for password resetting operations
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

//Endpoint relevant for updating authenticated users, hense the route is protected
userRouter.patch('/updateMyPassword', authController.protect, authController.updatePassword);
userRouter.patch('/updateMe', userController.uploadUserPhoto, userController.updateMe);

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