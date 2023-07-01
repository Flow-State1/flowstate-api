const express = require("express");
const userRouter = express.Router();
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

//Endpoint relevant for sign up authentication
userRouter.post('/signup', authController.signup);

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
  .delete(userController.deleteUser);

module.exports = userRouter;