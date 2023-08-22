const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/default');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, 'Please enter your name.']
    },
    email:{
        type: String,
        required: [true, 'Please enter your email address.'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address.']

    },
    role:{
        type: String,
        enum: {
            values:['user','employer'],
            message: 'Please select a correct role'
        },
        default: 'user'
    },
    password: {
        type: String,
        required:[true,'Please enter password for your account'],
        minlength: [8, 'Your password must be at least 8 character long'],
        selcet: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// Encrypting password before saving
userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10);
});

// Return json web token
userSchema.methods.getJwtToken =  function(){

    return jwt.sign({id: this._id}, config.jwt_secret,{
        expiresIn: config.jwt_expires_in,
    });

}

// compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);