const User = require('./../models/user');

//Function filters the object and takes in an array of allowed fileds
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  //Loop through the object fields
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) 
    {
      //New object will hold the allowed fields
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

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

//Function to allow the authenticated user to update their details
const updateMe = (async (req, res, next) => {
  try {
    // 1. Create an error if user trys (POSTs) to update password
    if(req.body.password || req.body.passwordConfirm) {
      return next(res.status(400).json({
        status: 'fail',
        message: 'This route is not for password update, Use /updateMyPassword'
      }));
    }
    // 2. Update user document
    //Filtered out unwanted fields that can't be updated and  kept the name and email
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  }
  catch(err) {
    console.log(err);
  }
});

//Function for deactivating the user when they delete their account
const deleteMe = (async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status: 'success',
    data: null
  });
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

const deleteUser = (async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined'
  });
  
});

module.exports = {
  getAllUsers,
  updateMe,
  getUser, 
  createUser, 
  updateUser, 
  deleteUser,
  deleteMe
}