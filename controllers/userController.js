const User = require('./../models/user');

//Functions that perform CRUD operations related on users
const getAllUsers = (async (req, res) => {
  try {
    const users = await User.find();

    //Send response
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  }
  catch(err) {
    console.log(err);
  }
});

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined'
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined'
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined'
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined'
  });
};

module.exports = {
  getAllUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser
}