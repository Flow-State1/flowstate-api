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
        minlength: 8
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
    }
}, {timestamps: true});

//Used the pre middleware to handle the encryption between getting the data and saving to database
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    //Remove the confirm password field from database after validation
    this.confirmPassword = undefined;
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;