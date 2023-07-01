const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_EXPIRES_IN;

exports.signup = (async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });
        const token = jwt.sign({ id: newUser._id }, secret, {
            expiresIn: expiration
        });

        //Parse token to the user after succuessful creation and sign them in
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    }
    catch(err){
        console.log(err);
    }
});