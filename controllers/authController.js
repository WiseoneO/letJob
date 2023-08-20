const userModel = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const sendToken = require('../utils/jwtToken');
// Register a new user =>/api/v1/user/register
exports.registerUser = catchAsyncErrors(async(req, res, next)=>{
    const {name,email,password,role} = req.body;

    const user = await userModel.create({
        name,
        email,
        password,
        role
    });

    sendToken(user, 200, res);
});

// Login in user  =>/api/v1/auth/login
exports.loginUser = catchAsyncErrors(async(req, res, next)=>{
    const {email, password} = req.body;

    // check if email orpassword is entered by users
    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    // check if email exist
    const user = await userModel.findOne({email: email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    // check if password is correct
    const isPasswordMatch = await user.comparePassword(password);

    if(!isPasswordMatch){
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    await sendToken(user, 200, res);
})