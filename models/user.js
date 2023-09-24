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
    photo: {
        type: Buffer,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
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
    passwordResetExpires: Date,
    active: {
        type : Boolean,
        default: true,
        select: false
    }
}, {timestamps: true});

//Used the pre middleware method to handle the encryption between getting the data and saving to database
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    //Hash the password with cost intensity of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Remove the confirm password field from database after validation
    this.confirmPassword = undefined;
    next();
});

//Query middleware function that runs before a query that starts with `find`
//It ensures we return users that are active (active status is not equals to false)
userSchema.pre(/^find/, function(next) {
    //this points to the current query(find)
    this.find({ active: {$ne : false} });
    next();
});

//Checks if password has been modified or there is a new user
userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

//An instance method that handles user password comparison, it's available on all documents of a certain collection
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

//Check if user has changed their password after the token was issued by comparing the times 
userSchema.methods.changedPasswordAfter = function(JWTTimestap) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestap < changedTimestamp;
    }
    return false;
}

//Instance method that handles user password reset token
userSchema.methods.createPasswordResetToken = function() {
    //Generate the reset token, converts to string hexadecimal for less memory usage
    const resetToken = crypto.randomBytes(32).toString('hex');

    //Hash the reset token using SHA-256 algorithm, then update the reset token to the hashed token
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //The user only has 10 minutes to reset their password
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;