const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_EXPIRES_IN;

const signToken = id => {
    return jwt.sign({ id: id }, secret, {
        expiresIn: expiration
    });
}

exports.signup = (async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });
        const token = signToken(newUser._id);

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

exports.login = (async (req, res, next) => {
    try {
        const {email, password} = req.body;

        // 1. Check if email and password exists
        if (!email || !password) {
            return next(res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            }));
        }

        // 2. Check if user exists and password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            }));
        }

        // 3. If every condition is met, send token to client/user
        const token = signToken(user._id);;
        res.status(200).json({
            status: 'success',
            token
        });
    }
    catch(err){
        console.log(err);
    }
});

exports.forgotPassword = async (req, res, next) => {
    try {
        //1. Get user based on posed email
        const user = await User.findOne({ email: req.body.email });
        if(!user) {
            return next(res.status(404).json({
                status: 'fail',
                message: 'There is no user with email address'
            }))
        }
        //2. Generate the random reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({validateBeforeSave: false});

        //3. Send it to the user's email
    } 
    catch(err) {
        console.log(err);
    }
}

exports.resetPassword = (req, res, next) => {}