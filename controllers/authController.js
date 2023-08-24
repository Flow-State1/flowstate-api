const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_EXPIRES_IN;
const cookieExpiration = process.env.JWT_COOKIE_EXPIRES_IN;
const sendEmail = require('./../utils/email');

// Functions generates and returns a token based on the user's id as input and uses the secret key for signing the token
const signToken = id => {
    return jwt.sign({ id: id }, secret, {
        expiresIn: expiration
    });
}

// Reduced the signToken function by implementing one fucntion and call it to relevant endpoints
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    //This will only work if our web app is hosted, so that cookies are sent in https
    const cookieOption = {
        expires: new Date(
        Date.now() + cookieExpiration * 24 * 60 * 60 * 1000
        ),
        //secure: true,
        httpOnly: true
    };
    //Attach the cookie to the response, so the token stored securely
    res.cookie('jwt', token, cookieOption);

    //Remove password from the output when creating a user
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signup = (async (req, res, next) => {
    try {
        // User creation using the User object from the userSchema, allows us to use methods of create()
        // Details properties are extracted from the `req.body`, it represents body of a http request sent by the client
        const { name, email, password, confirmPassword } = req.body;

        if(password != confirmPassword) {
            return next(res.status(400).json({
                status: 'fail',
                message: "Passwords do not match"
            }));
        }
        
        const newUser = await User.create({name, email, password, confirmPassword});
        // Parse token to the user after succuessful creation and sign them in
        createSendToken(newUser, 201, res);
    }
    catch(err){
        console.log(err);
    }
});

exports.login = (async (req, res, next) => {
    try {
        // Destructure client incoming request when logging in, received in json format
        const {email, password} = req.body;

        // 1. Check if email and password exists in the database
        if (!email || !password) {
            return next(res.status(400).json({
                status: 'fail',
                message: 'Provide email and password'
            }));
        }

        // 2. Check if user exists and password is correct, then query/fetch the data
        const user = await User.findOne({ email }).select('+password');

        // Call the instance method that compares the entered password with the one from the db
        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            }));
        }

        // 3. If every condition is met, call the signToken method and send token to client/user
        createSendToken(user, 200, res);
    }
    catch(err){
        console.log(err);
    }
});

// Middleware function that handles protected routes, by ensuring the user making the request is authenticated and authorized
exports.protect = (async (req, res, next) => {
    // 1. Getting token from the request headers and check if it exists
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(res.status(401).json({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access'
        }));
    }
    
    // 2. Verification of the token, allows us to get access to tokens data e.g user information
    const decoded = await promisify(jwt.verify)(token, secret);

    // 3. Check if user still exists in the database based on the decoded token
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(res.status(401).json({
            status: 'fail',
            message: 'The user belonging to this token does no longer exist'
        }));
    }
    // 4. Check if changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(res.status(401).json({
            status: 'fail',
            message: 'User recently changed password!. Please log in again'
        }));
    }
    // Grant access to protected route
    req.user = currentUser;
    next();
});


exports.forgotPassword = (async (req, res, next) => {
    try {
        // 1. Get user from the database based on the email provided in the request body
        const user = await User.findOne({ email: req.body.email });
        if(!user) {
            return next(res.status(404).json({
                status: 'fail',
                message: 'There is no user with email address'
            }));
        }

        // 2. Call the instance method that generates the random reset token
        const resetToken = user.createPasswordResetToken();
        //Save the changes to the database, skipping the validation option by making it false
        await user.save({validateBeforeSave: false});

        // 3. Send it to the user's email
        // Reset token endpoint
        const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
        const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.
        \nIf you didn't forget your password, Please ignore this email`;

        try {
            // Send email to the user containing the reset URL by passing user's email and relevant information
            await sendEmail({
                email: user.email,
                subject: 'Your Password Reset Token(valid for 10 min)',
                message
            });
    
            res.status(200).json({
                status: 'success',
                message: 'Token sent to email'
            });
        }
        catch(err) {
            // Remove the token and expiration date from the users document (database)
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            // Save the changes to the database, skipping the validation option by making it false
            await user.save({validateBeforeSave: false});

            return next(res.status(500).json({
                status: 'fail',
                message: 'There was an error sending an email. Try again'
            }));
        }
    } 
    catch(err) {
        console.log(err);
    }
});

exports.resetPassword = (async (req, res, next) => {
    // 1. Get user based on the token
    //Hash the token from params to match the one on the database
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    //Find the user for the token and check if the token has not expired
    const user = await User.findOne({ 
        passwordResetToken: hashedToken, 
        passwordResetExpires: {$gt: Date.now()} 
    });

    // 2. Set token, if token has not expired and there is a user, then set new password
    if (!user) {
        return next(res.status(400).json({
            status: 'fail',
            message: 'Token is invalid or has expired'
        }));
    }
    //Send the new passwords via the body as request from the client
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    //Remove the token details from the user document
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    //Save the changes to database, also applying the necessary validations
    await user.save();

    // 3. Update changedPasswordAt property for the user

    // 4. Log the user in, send JWT
    createSendToken(user, 200, res);
});

exports.updatePassword = (async (req, res, next) => {
    try {
        // 1. Get/query the user from the collection by their id
        const user = await User.findById(req.user.id).select('+password');

        // 2. Check if the POSTed current password is correct
        if (!(await user.correctPassword(req.body.currentPassword, user.password))){
            return next(res.status(401).json({
                status: 'fail',
                message: 'Your current password is wrong'
            }));
        }

        // 3. If password correct, then allow user to update 
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        await user.save();
        
        // 4. Log user in with the new password by sending a JWT
        createSendToken(user, 200, res);
    }
    catch(err)
    {
        console.log(err);
    }
});

exports.logout = (async (req, res, next) => {});