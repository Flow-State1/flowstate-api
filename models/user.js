const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

//User model schema - how the collection is structured in the database
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: { 
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password are not the same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {timestamps: true});

//Used the pre middleware to handle the encryption between getting the data and saving to database
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    //Hash the password with cost intensity of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Remove the confirm password field from database after validation
    this.confirmPassword = undefined;
    next();
});

//An instance method, is available on all documents of a certain collection
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

//Instance method that handles user password reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({resetToken}, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //The user only has 10 minutes to reset their password

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;